require('dotenv').config();
const Discord = require('./discord.io');
const logger = require('winston');
const config = require('./config.json');
const utils = require('./utils.js');
const jsdom = require("jsdom");
const https = require('https');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const igdb = require('igdb-api-node').default;

var twitch =
{
    id: process.env.TWITCH_ID,
    secret: process.env.TWITCH_SECRET,
    token: ""
};

// Configure logger settings

logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {

    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({

    token: process.env.DISCORD_TOKEN,

    autorun: true

});

bot.on('ready', function (evt) {

    logger.info('Connected');

    logger.info('Logged in as: ');

    logger.info(bot.username + ' - (' + bot.id + ')');
});

async function gameComment(game, count)
{
    if(count >= 100) return;

    completion = await openai.createCompletion({
        model: config.model,
        max_tokens: 300,
        prompt: config.prompt.replace("%NAME%", game.name),
    })    
    
    if(completion.data.choices[0].finish_reason == "length") 
    {
        await gameComment(count+1);
    }
    else
    {
        var comment = completion.data.choices[0].text;
        comment = comment.replace(/(\r\n|\n|\r)/gm, "");
        comment = comment.replace(/^["'](.+(?=["']$))["']$/, '$1');
        bot.sendMessage({
            to: config.channel,
            message: `${comment}\n${game.url}`        
        });
    }
}

archive = new Set(); // do not repeat games we have talked about in the past

// Clear archive periodically every hour
function clearArchive()
{
    archive.clear();
    const epsilon = 100;
    setTimeout(arguments.callee, (config.gameAge * 1000 * 3600) + epsilon); // clear archive every two hours
}

async function updateIndieGames()
{
    igdbClient = igdb(twitch.id, twitch.token);    

    time = utils.getHoursAgo(config.gameAge);
    response = await igdbClient
    .where(`created_at < ${time.getTime()}`) // filter the results
    .where(`genres = (${config.category})`) // indie games
    .sort('first_release_date', 'desc')
    .fields(['*', 'name'])
    .request('/games'); // execute the query and return a response object        

    for ([key, game] of Object.entries(response.data))
    {
        if(!archive.has(game.id))
        {
            archive.add(game.id);
            await gameComment(game, 0);
        }
    }
    
    // repeat every 5 second
    // twitch will allow you to do 4 per second but this is enough
    setTimeout(arguments.callee, config.refreshRate * 1000);
}

(async () => {
    response = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${twitch.id}&client_secret=${twitch.secret}&grant_type=client_credentials`);
    twitch.token = response.data.access_token;
    clearArchive();
    await updateIndieGames();
})()





  
