// https://stackoverflow.com/a/39914235
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
