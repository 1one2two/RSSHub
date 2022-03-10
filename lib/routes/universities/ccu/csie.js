const got = require('@/utils/got');
const cheerio = require('cheerio');

const baseUrl = 'https://www.ccu.edu.tw/bullentin_list.php?id=';

module.exports = async (ctx) => {
    let type = ctx.params && ctx.params.type;
    if (type === undefined) {
        type = '0';
    }

    const response = await got({
        method: 'get',
        url: baseUrl + type,
    });

    const $ = cheerio.load(response.data);
    // console.log($('.container-fluid'));
    // console.log('---------');
    // var value = $('.container-fluid').map((index, item) => {
    //     console.log(index, item);
    //     return item;
    // }).get();
    // console.log('---------');
    // console.log(value);
    ctx.state.data = {
        title: `中正大學`,
        link: baseUrl + type,
        description: `中正大學`,
        item: $('.container-fluid')
            .map((index, item) => ({
                title: $(item).find('.col-lg-9 a').first().text().trim(),
                description: '',
                pubDate: $(item).find('.col-lg-2').first().text().trim(),
                link: $(item).find('.col-lg-9 a').first().attr('href'), // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
