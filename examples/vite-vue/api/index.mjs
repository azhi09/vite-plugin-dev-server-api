export default function () {
  return {
    "/dev/server/api/mjs/pending": function () {
      return new Promise((resolve) => {
        setTimeout(() => resolve("3s pending"), 3 * 1000);
      });
    },
  };
}
