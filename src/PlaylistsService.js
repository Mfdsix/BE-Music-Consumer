const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getById ({
    playlistId,
    userId
  }) {
    const result = await this._pool.query(`SELECT p.id, p.name, u.fullname as owner FROM playlists p
    LEFT JOIN collaborations c ON c.playlist_id = p.id
    JOIN users u ON u.id = p.owner
    WHERE (p.owner = $1 OR c.user_id = $1)
    AND p.id = $2
    GROUP BY p.id, u.username`, [
      userId,
      playlistId
    ])

    const playlist = result.rows[0]
    if (playlist) {
      playlist.songs = await this.getSongs(playlistId)
    }

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
