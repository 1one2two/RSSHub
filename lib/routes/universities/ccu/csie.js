const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.cs.ccu.edu.tw/';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: baseUrl,
    });

    const $ = cheerio.load(response.data);
    ctx.state.data = {
        title: `中正大學資訊工程學系暨研究所`,
        link: baseUrl,
        description: `中正大學資訊工程學系暨研究所`,
        item: $('tbody tr')
            .map((index, item) => ({
                title: $(item).find('td')[1].text().trim(),
                description: '',
                pubDate: $(item)
                    .find('span')
                    .first()
                    .text()
                    .match(/\d{4}-\d{2}-\d{2}/g)[0],

                link: baseUrl + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
