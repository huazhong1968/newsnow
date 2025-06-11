import { defineSource } from "../utils/source"
import { myFetch } from "../utils/fetch"
import { proxyPicture } from "../utils/proxy"

interface Res {
  data: {
    target: {
      id: number
      title: string
      url: string
      created: number
      answer_count: number
      follower_count: number
      bound_topic_ids: number[]
      comment_count: number
      is_following: boolean
      excerpt: string
    }
    card_label?: {
      icon: string
      night_icon: string
    }
  }[]
}

export default defineSource({
  zhihu: async () => {
    const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20&desktop=false"
    const res: Res = await myFetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "x-api-version": "3.0.91",
        "x-app-version": "6.47.0",
        "x-app-za": "OS=iOS",
        "x-requested-with": "fetch",
        "x-zse-93": "101_3_3.0",
        "x-zse-96": "2.0_",
        "x-ab-param": "",
        "x-ab-pb": "",
        "Referer": "https://www.zhihu.com/hot",
        "Origin": "https://www.zhihu.com",
        "Cookie": "d_c0=ALBxq2YqFw2PTiIuFbq9iJfXtZJ3HmQ=|1677721600"
      }
    })
    return res.data
      .map((k) => {
        const urlId = k.target.url?.match(/(\d+)$/)?.[1]
        return {
          id: k.target.id,
          title: k.target.title,
          extra: {
            icon: k.card_label?.night_icon && proxyPicture(k.card_label.night_icon),
          },
          url: `https://www.zhihu.com/question/${urlId || k.target.id}`,
        }
      })
  },
})
