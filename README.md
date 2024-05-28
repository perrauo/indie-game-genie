# Indie Game Genie
Indie game announcements bot for Discord

![image](https://github.com/perrauo/indie-game-genie/assets/24371247/273c632c-0cca-4537-b1e1-9ea1b1a49aae)


# Discord.io fix
  * The following was broken inside of discord.io. Had to settle with temporary fix. Let me know if there is a better solution.

```
function Member(client, server, data) {
	copyKeys(data, this, ['user', 'joined_at',]);
	this.id = data.user.id;
	this.joined_at = Date.parse(data.joined_at);
	this.color = colorFromRole(server, this);
	// CHANGED
	var tempThis = this;
	['username', 'discriminator', 'bot', 'avatar', 'game'].forEach(function(k) {
		if (k in Member.prototype) return;

		Object.defineProperty(Member.prototype, k, {
			get: function() { return client.users[tempThis.id][k]; },
			set: function(v) { client.users[tempThis.id][k] = v; },
			enumerable: true,
		});
	});
}
```
