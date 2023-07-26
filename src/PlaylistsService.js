const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getById (playlistId) {
    const result = await this._pool.query(`SELECT p.id, p.name, u.fullname as owner FROM playlists p
    JOIN users u ON u.id = p.owner
    WHERE p.id = $1
    GROUP BY p.id, u.username`, [
      playlistId
    ])

    if (result.rows.length === 0) throw new Error('Playlist tidak ditemukan')

    const playlist = result.rows[0]
    playlist.songs = await this.getSongs(playlistId)

    return playlist
  }

  async getSongs (playlistId) {
    const result = await this._pool.query(`SELECT s.id, s.title, s.performer FROM songs s
    JOIN playlist_songs ps ON ps.song_id = s.id
    WHERE ps.playlist_id = $1`, [
      playlistId
    ])

    return result.rows
  }
}

module.exports = PlaylistsService
