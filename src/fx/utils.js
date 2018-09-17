export const toHttps = (url) => (""+url).indexOf('http:')>=0?(""+url).replace("http:", "https:"):url
