// place files you want to import through the `$lib` alias in this folder.
// import XLg from './icons/XLg.svelte';

// export default {
//   XLg
// };


 export const slugify = (str) => {
  console.log("slugify called with:", str)
  return String(str)
    .replace(/\s+/g, '_') // replace spaces with underscores
    .trim() // trim leading or trailing whitespace
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .toLowerCase() // convert to lowercase
    // .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/[^a-z0-9 _-]/g, '') // now allows underscores
    .replace(/-+/g, '-') // remove consecutive hyphens
}