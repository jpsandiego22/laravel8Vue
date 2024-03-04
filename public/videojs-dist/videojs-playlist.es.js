/*! @name videojs-playlist @version 6.0.0-0 @license Apache-2.0 */
import videojs from 'video.js';
import _extends from '@babel/runtime/helpers/extends';

var version = "6.0.0-0";

/**
 * Checks if the given index is within the bounds of the array.
 *
 * @param {Array} array - The array to check against.
 * @param {number} index - The index to verify.
 * @return {boolean} - Returns true if the index is a number and lies within the array's bounds, otherwise false.
 */
const isIndexInBounds = (array, index) => {
  return typeof index === 'number' && index >= 0 && index < array.length;
};

/**
 * Randomizes array elements in place.
 *
 * @param {Array} array - The array to shuffle.
 */
const randomize = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * This is standalone class that encapsulates all playlist logic that does not require a `player` instance
 */
class Playlist extends videojs.EventTarget {
  /**
   * Creates a new Playlist instance from a given array of items.
   *
   * @param {Object[]} items - An array of objects to initialize the playlist.
   * @param {Object} options - An options object to pass to the Playlist constructor
   * @return {Playlist} A new Playlist instance populated with the given items.
   */
  static from(items, options) {
    const playlist = new Playlist(options);
    playlist.set(items);
    return playlist;
  }
  constructor(options = {}) {
    super();
    /**
     * Validates and sanitizes the structure and sources of a single playlist item
     *
     * @param {Object} item - The playlist item to be processed. It should be an object with a `sources` array.
     * @return {Object|null} A sanitized playlist item object with valid sources, or null if the item is invalid.
     */
    this.sanitizePlaylistItem_ = item => {
      if (!item || typeof item !== 'object' || !Array.isArray(item.sources)) {
        this.onError_('Invalid playlist item: Must be an object with a `sources` array.');
        return null;
      }
      const validSources = item.sources.filter(source => source && typeof source === 'object' && typeof source.src === 'string' && typeof source.type === 'string');
      if (validSources.length === 0) {
        this.onError_('Invalid playlist item: No valid sources were found.');
        return null;
      }
      if (validSources.length < item.sources.length) {
        this.onWarn_('Some invalid playlist item sources were disregarded.');
      }
      const {
        poster = '',
        textTracks = []
      } = item;
      return _extends({}, item, {
        poster,
        textTracks,
        sources: validSources
      });
    };
    this.list_ = [];
    this.currentIndex_ = null;
    this.repeat_ = false;
    this.onError_ = options.onError || (() => {});
    this.onWarn_ = options.onWarn || (() => {});
  }

  /**
   * Sets the playlist with a new list of items, overriding any existing items.
   *
   * @param {Object[]} items - An array of objects to set as the new playlist.
   * @return {Object[]} A shallow clone of the array of the playlist items.
   * @fires playlistchange - Triggered after the contents of the playlist are changed.
   *                         This event indicates that the current playlist has been updated.
   */
  set(items) {
    if (!Array.isArray(items)) {
      this.onError_('The playlist must be an array.');
      return [...this.list_];
    }
    const playlistItems = items.map(this.sanitizePlaylistItem_).filter(item => item !== null);
    if (playlistItems.length === 0) {
      this.onError_('Cannot set the playlist as none of the provided playlist items were valid.');
      return [...this.list_];
    }

    // If we have valid items, proceed to set the new playlist
    this.list_ = playlistItems;
    this.trigger('playlistchange');
    return [...this.list_];
  }

  /**
   * Retrieves the current playlist.
   *
   * @return {Object[]} A shallow clone of the current list of playlist items.
   */
  get() {
    return [...this.list_];
  }

  /**
   * Removes the current playlist in its entirety without unloading the currently loaded source
   */
  reset() {
    this.currentIndex_ = null;
    this.list_ = [];
    this.trigger('playlistchange');
  }

  /**
   * Enables repeat mode. When enabled, the playlist will loop back to the first item after the last item.
   */
  enableRepeat() {
    this.repeat_ = true;
  }

  /**
   * Disables repeat mode. When disabled, the playlist will not loop back to the first item after the last item.
   */
  disableRepeat() {
    this.repeat_ = false;
  }

  /**
   * Retrieves the current repeat mode status of the playlist.
   *
   * @return {boolean} - True if repeat mode is enabled, false otherwise.
   */
  isRepeatEnabled() {
    return this.repeat_;
  }

  /**
   * Sets the current index to the specified value.
   *
   * @param {number} index - The index to be set as the current index.
   */
  setCurrentIndex(index) {
    if (!isIndexInBounds(this.list_, index)) {
      this.onError_('Cannot set index that is out of bounds.');
      return;
    }
    this.currentIndex_ = index;
  }

  /**
   * Retrieves the currently active playlist item object.
   *
   * @return {Object|undefined} The current playlist item if available, or undefined if no current item.
   */
  getCurrentItem() {
    return this.list_[this.currentIndex_];
  }

  /**
  * Retrieves the index of the currently active item in the playlist.
  *
  * @return {number} The current item's index if available, or -1 if no current item.
  */
  getCurrentIndex() {
    if (this.currentIndex_ === null) {
      return -1;
    }
    return this.currentIndex_;
  }

  /**
   * Get the index of the last item in the playlist.
   *
   * @return {number} The index of the last item in the playlist or -1 if there are no items.
   */
  getLastIndex() {
    return this.list_.length ? this.list_.length - 1 : -1;
  }

  /**
   * Calculates the index of the next item in the playlist.
   *
   * @return {number} The index of the next item or -1 if at the end of the playlist
   *                  and repeat is not enabled.
   */
  getNextIndex() {
    if (this.currentIndex_ === null) {
      return -1;
    }
    const nextIndex = (this.currentIndex_ + 1) % this.list_.length;
    return this.repeat_ || nextIndex !== 0 ? nextIndex : -1;
  }

  /**
   * Calculates the index of the previous item in the playlist.
   *
   * @return {number} The index of the previous item or -1 if at the beginning of the playlist
   *                  and repeat is not enabled.
   */
  getPreviousIndex() {
    if (this.currentIndex_ === null) {
      return -1;
    }
    const previousIndex = (this.currentIndex_ - 1 + this.list_.length) % this.list_.length;
    return this.repeat_ || previousIndex !== this.list_.length - 1 ? previousIndex : -1;
  }

  /**
   * A custom DOM event that is fired when new item(s) are added to the current
   * playlist (rather than replacing the entire playlist).
   *
   * @typedef  {Object} PlaylistAddEvent
   * @see      [CustomEvent Properties]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
   * @property {string} type - Always "playlistadd"
   *
   * @property {number} count - The number of items that were added.
   *
   * @property {number} index - The starting index where item(s) were added.
   */

  /**
   * Adds one or more items to the playlist at the specified index or at the end if the index is not provided or invalid.
   * If items is empty or contains only invalid items, no items are added, and an empty array is returned.
   *
   * @param {Object|Object[]} items - The item or array of items to add.
   * @param {number} [index] - The index at which to add the items. Defaults to the end of the playlist.
   * @return {Object[]} The array of added playlist items or an empty array if no valid items were provided.
   * @fires playlistadd - Triggered when items are successfully added.
   */
  add(items, index) {
    if (!Array.isArray(items)) {
      if (typeof items === 'object' && items !== null) {
        items = [items];
      } else {
        this.onError_('Provided items must be an object or an array of objects.');
        return [];
      }
    }
    const resolvedIndex = typeof index !== 'number' || index < 0 || index > this.list_.length ? this.list_.length : index;
    const beforeItems = this.list_.slice(0, resolvedIndex);
    const afterItems = this.list_.slice(resolvedIndex);
    const newItems = items.map(this.sanitizePlaylistItem_).filter(item => item !== null);
    if (newItems.length === 0) {
      this.onError_('Cannot add items to the playlist as none were valid.');
      return [];
    }
    this.list_ = [...beforeItems, ...newItems, ...afterItems];

    // Update currentIndex if inserting new elements earlier in the array than the current item
    if (resolvedIndex <= this.currentIndex_) {
      this.currentIndex_ += newItems.length;
    }
    this.trigger({
      type: 'playlistadd',
      count: newItems.length,
      index: resolvedIndex
    });
    return [...newItems];
  }

  /**
   * A custom DOM event that is fired when new item(s) are removed from the
   * current playlist (rather than replacing the entire playlist).
   *
   * This is fired synchronously as it does not affect playback.
   *
   * @typedef  {Object} PlaylistRemoveEvent
   * @see      [CustomEvent Properties]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
   * @property {string} type - Always "playlistremove"
   *
   * @property {number} count - The number of items that were removed.
   *
   * @property {number} index - The starting index where item(s) were removed.
   */

  /**
   * Removes a specified number of items from the playlist, starting at the given index.
   * Adjusts the current index if it falls within the range of the removed items.
   *
   * @param {number} index - The starting index to remove items from. If out of bounds, no removal occurs.
   * @param {number} [count=1] - The number of items to remove. Defaults to 1. Removal occurs only if count is a positive number.
   * @return {Object[]} An array of the removed playlist items.
   * @fires playlistremove - Triggered when items are successfully removed.
   */
  remove(index, count = 1) {
    if (!isIndexInBounds(this.list_, index)) {
      this.onError_('Index is out of bounds.');
      return [];
    }
    if (typeof count !== 'number' || count < 0) {
      this.onError_('Invalid count for removal.');
      return [];
    }

    // Constrain the removal count to the number of items that are actually available to remove starting at that index
    const actualCount = Math.min(count, this.list_.length - index);
    const removedItems = this.list_.splice(index, actualCount);
    this.adjustCurrentIndexAfterRemoval_(index, actualCount);
    this.trigger({
      type: 'playlistremove',
      count: actualCount,
      index
    });
    return [...removedItems];
  }

  /**
   * Sorts the playlist array.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
   * @param {Function} compare - A comparator function as per the native Array method.
   * @fires playlistsorted - Triggered after the playlist is sorted internally.
   */
  sort(compare) {
    if (!this.list_.length || typeof compare !== 'function') {
      return;
    }
    const currentItem = this.getCurrentItem();
    this.list_.sort(compare);

    // Update the current index after sorting
    this.currentIndex_ = this.list_.indexOf(currentItem);
    this.trigger('playlistsorted');
  }

  /**
   * Reverses the order of the items in the playlist.
   *
   * @fires playlistsorted - Triggered after the playlist is sorted internally.
   */
  reverse() {
    if (!this.list_.length) {
      return;
    }
    this.list_.reverse();

    // Invert the current index
    this.currentIndex_ = this.list_.length - 1 - this.currentIndex_;
    this.trigger('playlistsorted');
  }

  /**
   * Shuffle the contents of the list randomly.
   * If 'rest' is true, only items after the current item are shuffled.
   *
   * @param {boolean} [options.rest = true] - Shuffle only items after the current item.
   * @fires playlistsorted - Triggered after the playlist is sorted internally.
   */
  shuffle({
    rest = true
  } = {}) {
    const startIndex = rest ? this.currentIndex_ + 1 : 0;
    const itemsToShuffle = this.list_.slice(startIndex);
    if (itemsToShuffle.length <= 1) {
      return;
    }
    const currentItem = this.getCurrentItem();
    randomize(itemsToShuffle);
    if (rest) {
      this.list_.splice(startIndex, itemsToShuffle.length, ...itemsToShuffle);
    } else {
      this.list_ = itemsToShuffle;
    }

    // Set the new index of the current item
    this.currentIndex_ = this.list_.indexOf(currentItem);
    this.trigger('playlistsorted');
  }
  /**
   * Adjusts the current index after items have been removed from the playlist.
   * This method accounts for the removal position relative to the current index.
   *
   * @param {number} index - The starting index from which items were removed.
   * @param {number} actualCount - The actual number of items removed.
   * @private
   */
  adjustCurrentIndexAfterRemoval_(index, actualCount) {
    // If the removals are happening after the current item, no index adjustment is needed
    if (this.currentIndex_ < index) {
      return;
    }

    // Removals are happening before the current item, but the current item is not within the removed range
    if (this.currentIndex_ >= index + actualCount) {
      this.currentIndex_ -= actualCount;
      return;
    }

    // The current item is within the removed range
    this.currentIndex_ = null;
  }
}

/**
 * Manages the auto-advance functionality in a media player.
 * Auto-advance automatically moves to the next item after a specified delay.
 */
class AutoAdvance {
  /**
   * Creates an instance of the AutoAdvance class.
   *
   * @param {Object} player
   *        The media player instance.
   * @param {Function} advanceCallback
   *        The callback function to execute when advancing to the next item.
   */
  constructor(player, advanceCallback) {
    /**
     * Starts the auto-advance timeout.
     *
     * @private
     */
    this.startTimeout_ = () => {
      // Ensure we don't stack timeouts
      this.clearTimeout_();
      if (this.delay_ === null) {
        return;
      }

      // Listen for a play event to cancel auto-advance if it occurs before the timeout completes
      this.player_.one('play', this.clearTimeout_);

      // Set a new timeout for auto-advancing
      this.timeoutId_ = setTimeout(() => {
        this.advanceCallback_();

        // Clean up the listener for the play event when the auto-advance triggers
        this.clearTimeout_();
      }, this.delay_ * 1000);
    };
    /**
     * Clears the current auto-advance timeout and removes the 'play' event listener.
     *
     * @private
     */
    this.clearTimeout_ = () => {
      if (this.timeoutId_) {
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = null;
        this.player_.off('play', this.clearTimeout_);
      }
    };
    this.player_ = player;
    this.advanceCallback_ = advanceCallback;
    this.delay_ = null;
    this.timeoutId_ = null;
  }

  /**
   * Sets the delay for auto-advance.
   * If the delay is invalid or not zero or a positive number, auto-advance is cancelled.
   *
   * @param {number} seconds
   *        The delay in seconds before auto-advancing.
   */
  setDelay(seconds) {
    // Cancel any existing auto-advance behavior and start fresh
    this.fullReset();

    // If delay is invalid or undefined, do nothing further (auto-advance already cancelled)
    if (typeof seconds !== 'number' || seconds < 0 || !isFinite(seconds)) {
      return;
    }

    // Set the new delay and start listening for 'ended' to trigger auto-advance
    this.delay_ = seconds;
    this.player_.on('ended', this.startTimeout_);
  }

  /**
   * Gets the delay for auto-advance.
   */
  getDelay() {
    return this.delay_;
  }
  /**
   * Cancels and resets all auto-advance behavior
   */
  fullReset() {
    this.clearTimeout_();
    this.player_.off('ended', this.startTimeout_);
    this.delay_ = null;
  }
}

const Plugin = videojs.getPlugin('plugin');

// Exported for testing purposes
const log = videojs.log.createLogger('videojs-playlist');
class PlaylistPlugin extends Plugin {
  /**
   * Creates a new Playlist instance from an array of items.
   *
   * @param {Object[]} items - The array of playlist items.
   * @return {Playlist} The created Playlist instance.
   */
  static createPlaylistFrom(items) {
    return Playlist.from(items, {
      onError: log.error,
      onWarn: log.warn
    });
  }

  /**
   * Constructs a PlaylistPlugin instance.
   *
   * @param {Object} player - The video.js player instance.
   * @param {Object} options - The plugin options.
   */
  constructor(player, options) {
    super(player);
    /**
     * Plays the next item in the playlist.
     *
     * @private
     */
    this.playNext_ = () => {
      const loadedNext = this.loadNextItem({
        loadPoster: false
      });
      if (loadedNext) {
        this.player.play();
      }
    };
    /**
     * Handles changes to the player's source.
     *
     * @private
     */
    this.handleSourceChange_ = () => {
      const currentSrc = this.player.currentSrc();
      if (!this.isSourceInPlaylist_(currentSrc)) {
        this.handleNonPlaylistSource_();
      }
    };
    this.playlist_ = null;
    this.autoAdvance_ = null;
  }

  /**
   * Loads a playlist and sets up related functionality.
   *
   * @param {Playlist} playlist - The playlist to load.
   */
  loadPlaylist(playlist) {
    // Clean up any existing playlist
    this.unloadPlaylist();
    this.playlist_ = playlist;
    this.autoAdvance_ = new AutoAdvance(this.player, this.playNext_);
    this.setupEventForwarding_();

    // Begin handling non-playlist source changes.
    this.player.on('loadstart', this.handleSourceChange_);
  }

  /**
   * Unloads the current playlist and associated functionality.
   */
  unloadPlaylist() {
    if (this.playlist_) {
      this.playlist_.reset();
      this.cleanupEventForwarding_();
    }
    if (this.autoAdvance_) {
      this.autoAdvance_.fullReset();
    }

    // Stop handling non-playlist source changes
    this.player.off('loadstart', this.handleSourceChange_);
  }

  /**
   * Sets the auto-advance delay.
   *
   * @param {number} delayInSeconds - The delay in seconds.
   */
  setAutoadvanceDelay(delayInSeconds) {
    if (!this.autoAdvance_) {
      return;
    }
    this.autoAdvance_.setDelay(delayInSeconds);
  }

  /**
   * Retrieves the current auto-advance delay.
   *
   * @return {number|null} The delay in seconds, or null if not set.
   */
  getAutoadvanceDelay() {
    if (!this.autoAdvance_) {
      return null;
    }
    return this.autoAdvance_.getDelay();
  }

  /**
   * Loads a specific playlist item by index.
   *
   * @param {number} index - The index of the item to load.
   * @param {boolean} options.loadPoster - Whether or not the item's poster image should be loaded
   * @return {boolean} True if the item was loaded successfully, false otherwise.
   */
  loadPlaylistItem(index, {
    loadPoster = true
  } = {}) {
    const items = this.playlist_.get();
    if (!isIndexInBounds(items, index)) {
      log.error('Index is out of bounds.');
      return false;
    }
    this.loadItem_(items[index], {
      loadPoster
    });
    this.playlist_.setCurrentIndex(index);
    return true;
  }

  /**
   * Loads the first item in the playlist.
   *
   * @return {boolean} True if the first item was loaded successfully, false otherwise.
   */
  loadFirstItem() {
    return this.loadPlaylistItem(0);
  }

  /**
   * Loads the last item in the playlist.
   *
   * @return {boolean} True if the last item was loaded successfully, false otherwise.
   */
  loadLastItem() {
    const lastIndex = this.playlist_.getLastIndex();
    return this.loadPlaylistItem(lastIndex);
  }

  /**
   * Loads the next item in the playlist.
   *
   * @param {boolean} options.loadPoster - Whether or not the next item's poster image should be loaded
   * @return {boolean} True if the next item was loaded successfully, false otherwise.
   */
  loadNextItem({
    loadPoster = true
  } = {}) {
    const nextIndex = this.playlist_.getNextIndex();
    if (nextIndex === -1) {
      return false;
    }
    return this.loadPlaylistItem(nextIndex, {
      loadPoster
    });
  }

  /**
   * Loads the previous item in the playlist.
   *
   * @return {boolean} True if the previous item was loaded successfully, false otherwise.
   */
  loadPreviousItem() {
    const previousIndex = this.playlist_.getPreviousIndex();
    if (previousIndex === -1) {
      return false;
    }
    return this.loadPlaylistItem(previousIndex);
  }

  /**
   * Loads a specific playlist item.
   *
   * @param {Object} item - The playlist item to load.
   * @param {boolean} options.loadPoster - Whether or not the item's poster image should be loaded
   * @private
   */
  loadItem_(item, {
    loadPoster = true
  } = {}) {
    this.player.trigger('beforeplaylistitem', item);

    // Remove any textTracks from a previous item
    this.clearExistingItemTextTracks_();
    this.player.poster(loadPoster ? item.poster : '');
    this.player.src(item.sources);
    this.player.ready(() => {
      this.addItemTextTracks_(item);
      this.player.trigger('playlistitem', item);
    });
  }

  /**
   * Sets up event forwarding from the playlist to the player.
   *
   * @private
   */
  setupEventForwarding_() {
    const playlistEvents = ['playlistchange', 'playlistadd', 'playlistremove', 'playlistsorted'];
    playlistEvents.forEach(eventType => this.playlist_.on(eventType, event => this.player.trigger(event)));
  }

  /**
   * Cleans up event forwarding from the playlist to the player.
   *
   * @private
   */
  cleanupEventForwarding_() {
    const playlistEvents = ['playlistchange', 'playlistadd', 'playlistremove', 'playlistsorted'];
    playlistEvents.forEach(eventType => this.playlist_.off(eventType, this.handlePlaylistEvent_));
  }
  /**
   * Clears text tracks of the currently loaded item.
   *
   * @private
   */
  clearExistingItemTextTracks_() {
    const textTracks = this.player.remoteTextTracks();
    let i = textTracks && textTracks.length || 0;

    // This uses a `while` loop rather than `forEach` because the
    // `TextTrackList` object is a live DOM list (not an array).
    while (i--) {
      this.player.removeRemoteTextTrack(textTracks[i]);
    }
  }

  /**
   * Adds text tracks for a playlist item.
   *
   * @param {Object} item - The playlist item.
   * @private
   */
  addItemTextTracks_(item) {
    item.textTracks.forEach(this.player.addRemoteTextTrack.bind(this.player));
  }
  /**
   * Checks if the current source is in the playlist.
   *
   * @param {string} src - The source URL to check.
   * @return {boolean} True if the source is in the playlist, false otherwise.
   * @private
   */
  isSourceInPlaylist_(src) {
    const itemList = this.playlist_.get();
    return itemList.some(item => item.sources.some(source => source.src === src));
  }

  /**
   * Handles playback when the current source is not in the playlist.
   *
   * @private
   */
  handleNonPlaylistSource_() {
    this.autoAdvance_.fullReset();
    this.playlist_.setCurrentIndex(null);
  }
}

// Include the version number.
PlaylistPlugin.VERSION = version;

// Register the plugin with video.js.
videojs.registerPlugin('playlistPlugin', PlaylistPlugin);

export { AutoAdvance, Playlist, PlaylistPlugin as default };
