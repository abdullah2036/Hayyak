'use client';
import View from '@/views/CertSheet.view';
import { waxPath } from '@/ui/kit';
import { certVals } from '@/ui/cert';

const WAX = waxPath(1.3);

/**
 * One certificate, drawn the same way in the editor, on the guest's page and in the downloaded file.
 * The drawn signature is only a placeholder for the editor (data.sample); a real certificate never carries one.
 */
export default function CertSheet({ config: c, data }) {
  const cust = c.tpl === 2;
  return (
    <View
      v={{
        ...c, ...certVals(c, data), wax: WAX, notCustom: !cust, isCustom: cust, isAr: c.lang !== 'bi', isBi: c.lang === 'bi', hasLogo: Boolean(c.logo), noLogo: !c.logo, hasSig: Boolean(c.sigImg), noSig: !c.sigImg && Boolean(data.sample), hasBg: Boolean(c.bg), noBg: !c.bg, issueDate: data.event.long + 'م',
      }}
    />
  );
}
