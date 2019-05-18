import algoliasearch from "algoliasearch";
var client = algoliasearch("HQ9I5Z6IM5", "6466695ec3f624a5fccf46ec49680e51");

var index = client.initIndex("Skins");

export function search(query) {
  return new Promise((resolve, reject) => {
    index.search(
      {
        query,
        attributes: ["objectID", "fileName", "color"],
        attributesToHighlight: [],
        hitsPerPage: 1000,
        // https://www.algolia.com/doc/api-reference/api-parameters/typoTolerance/
        // min: Retrieve records with the smallest number of typos.
        typoTolerance: "min"
      },
      (err, content) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(content);
      }
    );
  });
}
