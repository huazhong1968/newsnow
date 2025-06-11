import { defineSource } from "../utils/source"
import { myFetch } from "../utils/fetch"
import { proxyPicture } from "../utils/proxy"
import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import type { Element as CheerioElement } from "cheerio"

export default defineSource({
  zhihu: async () => {
    const url = "https://www.zhihu.com/hot"
    const html = await myFetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": "https://www.zhihu.com/",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
      }
    })

    const $ = load(html)
    const items = $(".HotList-item")
    const news: NewsItem[] = []

    items.each((_: number, el: CheerioElement) => {
      const $el = $(el)
      const $title = $el.find(".HotItem-title")
      const title = $title.text()
      const url = $title.attr("href")
      const hot = $el.find(".HotItem-metrics").text().trim()
      const icon = $el.find(".HotItem-icon img").attr("src")

      if (title && url) {
        news.push({
          id: url.split("/").pop() || "",
          title,
          url: url.startsWith("http") ? url : `https://www.zhihu.com${url}`,
          extra: {
            info: hot,
            icon: icon && proxyPicture(icon)
          }
        })
      }
    })

    return news
  }
})
