class Listener {
  constructor (PlaylistsService, mailSender) {
    this._playlistsService = PlaylistsService
    this._mailSender = mailSender

    this.listen = this.listen.bind(this)
  }

  async listen (message) {
    try {
      const { playlistId, userId, targetEmail } = JSON.parse(message.content.toString())

      const playlist = await this._playlistsService.getById({
        playlistId,
        userId
      })

      if (playlist) {
        const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({ playlist }))
        console.log(result)
      } else {
        console.log('Playlist tidak ditemukan')
      }
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Listener
