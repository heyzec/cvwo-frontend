// https://stackoverflow.com/a/39914235
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// https://stackoverflow.com/q/11867545
export const isBright = (rgb) => (
  (
    parseInt(rgb.substring(1, 3), 16) * 0.299 +
    parseInt(rgb.substring(3, 5), 16) * 0.587 +
    parseInt(rgb.substring(5, 7), 16) * 0.114
  ) > 186 - 40
)

export const validateColor = (str) => str.match(/^#([\dA-F]{3}|[\dA-F]{6})$/i)
