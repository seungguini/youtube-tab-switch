# YouTube Tab Switch
## Description
YouTube Tab Switch is _the_ chrome extension that maintains one, and _only_ one video playback, no matter how many video tabs are open. _Pausing_ a video plays the **second-most recently played video**, and vice versa.

## Migration to React.js
[React](https://reactjs.org/) to display queued media
Connect with [Spotify API](https://developer.spotify.com/documentation/web-playback-sdk/)

## Analogy

Imagine a _switch_. A switch is binary: it can either be set to one or the other. Never both; never neither. **ON** or **OFF**.

YouTube Tab Switch maintains this analogy by **_always_** having one - and **_only_** one - video playing. Pausing a video automatically triggers another video to play, creating one constant, uninterrupted flow of video.

## Privacy

The app reads the urls of all tabs open on your computer to screen all YouTube related content and appends them to a list to track your videos. YouTube Tab Switch utilizes chrome storage to store your urls, creating a unique database for each user and accessible only to themselves. For inquiries, feel free to bring up an issue or email me at seungguini@gmail.com

## Need to temporarily disable YouTube Tab Switch?
Simply turn the app off through the popup _switch_!

## Installation
1. Download the `.zip` file and unpackage it
2. Make sure all YouTube tabs are closed first!
3. On your Chrome Browser, go to <chrome://extension>
4. Turn on **Developer Mode** on the top right corner
5. Select **Load Unpacked**
6. Select the _unzipped_ **YouTube Tab Switch** folder


## Author
**Year**: 2019  
**Programmer**: Seunggun Lee  
**Languages/Tools used**: Javascript, JQuery

## Credits!

Icons made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com/)

Tab designed by [Ilham Ibnu Purnomo](https://codepen.io/inupurnomo) on [CodePen](https://codepen.io/inupurnomo/pen/MWWRmQr?editors=0100#0)

Switch designed by [Marcus Connor](https://codepen.io/marcusconnor/) on [CodePen](https://codepen.io/marcusconnor/pen/QJNvMa)

Social Media Button designed by [Kieran Hunter](https://codepen.io/kieranfivestars) on [CodePen](https://codepen.io/kieranfivestars/pen/gbOWbM/)

## Features to Add:
- Managing multiple YouTube tabs
  - maintain a bird's-eye view of all open Youtube tabs
  - change the order of video playback
  - categorize Youtube videos to audio fill between user-designated genres
  - controlling video playback in another window through the extension (key-board shortcuts)
    - for quick and convenient playback control (esp. while coding alongside, etc)
  - **Toggle Options!**
    - an option to immediately show the tab of the video that is played when auto-switched
- Popup
  - Bootstrap Lists, progress, spinners