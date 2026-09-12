import baseWorker from './worker.js';

export default {
  async fetch(request, env, ctx) {
    let response = await baseWorker.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    if (request.method === 'GET' && type.includes('text/html')) {
      response = new HTMLRewriter()
        .on('head', { element(el) { el.append('<script src="/analytics.js" defer></script>', { html: true }); } })
        .transform(response);
    }
    return response;
  }
};
