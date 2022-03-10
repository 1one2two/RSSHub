const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.ccu.edu.tw/bullentin_list.php?id=0';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: baseUrl,
    });

    const $ = cheerio.load(response.data);
    console.log($('.container-fluid'));
    console.log('---------');
    var value = $('.container-fluid').map((index, item) => {
        console.log(index, item);
        return item;
    }).get();
    console.log('---------');
    console.log(value);
    ctx.state.data = {
        title: `中正大學資訊工程學系暨研究所`,
        link: baseUrl,
        description: `中正大學資訊工程學系暨研究所`,
        item: $('.container-fluid')
            .map((index, item) => ({
                title: $(item).find('.col-lg-2 a').first().text().trim(),
                description: '',
                pubDate: $(item).find('.col-lg-2').first().text().trim(),
                link: baseUrl, // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
