# youCover

jQuery plugin to wrap default YouTube Player to image cover

## Getting Started

Copy the (youCover) js and css files locate in dist folder into your project

Like Iframe
<div data-youcover data-width="100%" data-height="640" data-src='https://www.youtube.com/embed/BEtPCT7ZcE0?rel=0&amp;showinfo=0&amp;autoplay=1' data-allowfullscreen></div>

Change Icon, just replace .youCover:before in css file
<div data-youcover data-src='https://www.youtube.com/embed/BEtPCT7ZcE0?rel=0&amp;showinfo=0&amp;autoplay=0' data-wrapperclass='youCover icon2'></div>

Using ID width default settings
<div data-youcover data-id='3BhkeY974Rg'></div>

You Can use Fancybox vendors to single movie or gallery

Single
<div data-youcover data-fancybox data-id='3BhkeY974Rg'></div>

Gallery
<div data-youcover data-fancybox data-id='MGgr62ZrfdU' data-rel='galery'></div>
<div data-youcover data-fancybox data-id='ocwnns57cYQ' data-rel='galery'></div>
<div data-youcover data-fancybox data-id='xD7D5ZN1pro' data-rel='galery'></div>

*** View all examples in example/index.html

### Prerequisites

This plugin require jQuery

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
