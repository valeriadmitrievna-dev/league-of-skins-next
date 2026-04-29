import { getDictionary, getLocale } from "@/lib/i18n";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import SkinDetails from "@/widgets/Skin/SkinDetails";
import SkinInfo from "@/widgets/Skin/SkinInfo";

const SkinPage = async ({ params }: { params: Promise<{ contentId: string }> }) => {
  const { contentId } = await params;

  const locale = await getLocale();
  const appData = await getLangAppData(getLanguageCode(locale));
  const skin = (appData?.skins ?? []).find((skin: any) => skin.contentId === contentId);

  if (!skin) {
    return <>No skin</>;
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8">
      <SkinInfo data={skin} />
      <SkinDetails data={skin} className="mt-4 order-first md:order-last md:mt-0" />
    </div>
  );
};

export default SkinPage;
