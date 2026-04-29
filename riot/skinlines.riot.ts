import { cDragonUrl } from "@/shared/constants/riot";

export const getSkinlines = async (lang: string = 'default', server: 'latest' | 'pbe' = 'latest') => {
  lang = lang.toLowerCase()
  const language = lang === 'en_us' ? 'default' : lang
  const url = `${cDragonUrl}/${server}/plugins/rcp-be-lol-game-data/global/${language}/v1/skinlines.json`

  try {
    const res = await fetch(url)
    const data: any[] = await res.json();
    return data;
  } catch (error) {
    console.error(`[ERROR][getSkinlines][${server}]`, (error as any).message)
  }
}
