import httpClient from './httpClient';

export function getBlocks() {
  const results = httpClient
    .get('/query/allblock/a/z')
    .then(res => {
      console.log('🚀 ~ file: index.js ~ line 7 ~ getBlocks ~ res', res);
      const results =
        res && res.data && res.data.data ? res.data.data.blockData : [];
      const status = res && res.data ? res.data.status : 200;
      return { results, status };
    })
    .catch(err => {
      console.log(err);
      return [];
    });
  return results;
}

export function addBlock(block) {
  return httpClient.post('/addblock', block);
}

export function getBlockById(id) {
  const results = httpClient
    .get(`/query/blockId/${id}`)
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err);
      return {};
    });
  return results;
}
