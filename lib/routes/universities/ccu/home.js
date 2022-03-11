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

    const description = $('.container-fluid')
        .map((index, item) => {
            await got({
                method: 'get',
                url: $(item).find('.col-lg-9 a').first().attr('href'),
            })
        })

    console.log(description);

    ctx.state.data = {
        title: `中正大學`,
        link: baseUrl + type,
        description: `中正大學`,
        item: $('.container-fluid')
            .map((index, item) => ({
                title: $(item).find('.col-lg-9 a').first().text().trim(),
                description: description[index],
                pubDate: $(item).find('.col-lg-2').first().text().trim(),
                link: $(item).find('.col-lg-9 a').first().attr('href'), // + $(item).find('td')[1].attr('href'),
            }))
            .get(),
    };
};
