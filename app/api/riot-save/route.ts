import { NextRequest } from 'next/server'
import { saveToJson } from '@/shared/utils/getFileData'
import { clearAppDataCache } from '@/shared/utils/getLangAppData'
import { baseFolder } from '@/shared/constants/riot'

export const POST = async (req: NextRequest) => {
  try {
    const { lang, data } = await req.json()
    await saveToJson(`${baseFolder}/${lang}.json`, { lang, updated: new Date(), ...data })
    clearAppDataCache()
    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}