# xmas-on-your-face

Whack a load of Xmas all over your face. Just cos.

### Intro

Made during a pebble {code}, Xmas themes hack day. If you have a camera that can be controlled by gphoto2 (via libgphoto2), then you should be able to use this.

When running, you can take your photo via the web interface, and have it suitably xmas-ified depending on whether you've been naughty or nice this year.

### Get Started

##### Prerequisites

Install libgphoto2 using your package manager of choice

e.g.

`brew install gphoto2`

##### Install

`git clone https://github.com/pebblecode/xmas-on-your-face.git`

`npm install`

`npm start`

Connect your camera to the machine running the server via USB, switch the camera on, and change the power setting to prevent it from going to sleep. Set the camera up, and line up a spot where subjects will need to stand/sit to have their photo taken.

Once the camera is set up, subjects can take their position, and browse to `<hostname/ip>:3000` to use it.

Note, there is a slight delay between triggering the photo from your phone to the shutter actually firing. Be patient. And still.

### Details

Triggering the photo is done via a shell command from the server. There is a little complication around ownership of the connected camera that has to be negotiated (e.g. on OSX, detect and kill the PTPCamera process first). This bit is a little unreliable, and pretty hacky, so if you encounter any problems, disconnect and reconnect your camera and try again.