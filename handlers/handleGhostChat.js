module.exports = async (client) => {
  client.handleGhost = async function(message) {
    if (message.channel.id === '854041292438503474') {
      if (message.author.bot) message.delete()
      if (message.content.includes('--nodelete') || message.content.includes('--dontdelete')) {
        return;
      } else message.delete({timeout:30000})
    }
  }
}
