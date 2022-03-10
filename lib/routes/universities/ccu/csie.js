const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.cs.ccu.edu.tw/api/announce?sort=-datetime&max_results=10&page=undefined';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: baseUrl,
    });

    const $ = cheerio.load(response.data);
    console.log($.xml());
    var value = $('resource').map((index, item) => {
        // console.log(index, item);
        return item;
    }).get();
    console.log(value);
    ctx.state.data = {
        title: `中正大學資訊工程學系暨研究所`,
        link: baseUrl,
        description: `中正大學資訊工程學系暨研究所`,
        item: $('resource')
            .map((index, item) => ({
                title: $(item).find('title').first().text().trim(),
                description: '',
                pubDate: $(item).find('_created').first().text().trim(),
                link: baseUrl, // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
