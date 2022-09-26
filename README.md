# Indie Game Genie
Indie game announcements bot for Discord

# Discord.io fix
  * The following was broken inside of discord.io. Had to settle with temporary fix. Let me know if there is a better solution.
```
function Member(client, server, data) {
	copyKeys(data, this, ['user', 'joined_at',]);
	this.id = data.user.id;
	this.joined_at = Date.parse(data.joined_at);
	this.color = colorFromRole(server, this);
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
