Wildfire Thinning
=================

By: Caleb Diehl

Links to interactive:

* **Production**: [https://apnews.com/projects/wildfire-thinning/index.html][prod]
* **Preview**: [https://interactives-preview.inside.ap.org/interactives/wildfire-thinning/][preview]

## Development

If you are cloning this interactive for and running it for the first time,
start by installing the necessary dependencies:

```shell
yarn install
```

Run this interactive in development by running:

```shell
yarn start
```

This will open your interactive in your browser.

## Optimizing images

This project includes a script that will generate multiple image
sizes and nextgen image formats (webp and avif), so that we can load the smallest possible image file for for a user's device and browser.
```
yarn prep-image ./path/to/image.jpg
```
It's also possible to run the script on a whole folder at once, with:
```
yarn prep-image ./path/to/directory
```




[prod]: https://apnews.com/projects/wildfire-thinning/index.html
[preview]: https://interactives-preview.inside.ap.org/interactives/wildfire-thinning/
