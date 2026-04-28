import { NextRequest } from 'next/server'
import { saveToJson } from '@/shared/api/utils/getFileData'
import { baseFolder } from '@/shared/api/constants'
import { clearAppDataCache } from '@/shared/api/utils/getLangAppData'

export const POST = async (req: NextRequest) => {
  try {
    const { lang, data } = await req.json()
    saveToJson(`${baseFolder}/${lang}.json`, { lang, updated: new Date(), ...data })
    clearAppDataCache()
    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}