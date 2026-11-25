'use client';
import { plural } from '@/lib/dates';
import { api } from './kit';

/** Prices change from the Studio, so the browser asks for them instead of carrying a copy. */
let cache;
export const loadPricing = () => (cache ||= api.get('/pricing').catch(() => { cache = null; return null; }));

export const freeText = (n) => (n ? `${plural(n, 'دعوة', 'دعوتين', 'دعوات')} مرة وحدة للتجربة` : 'بدون رصيد مجاني');
export const betaText = (b) => `نسخة تجريبية: الرصيد مجاني لين ${b.quota} دعوة لكل حساب`;

/** The assistant's answers that mention money. */
export const PRICE_ANSWERS = {
  'كم الأسعار؟': (p) => {
    if (!p) return 'الأسعار تلقاها في صفحة شراء الرصيد، وتشتريها مرة وحدة بدون اشتراك';
    const row = (k) => p.packs.map((x, i) => (i ? `${x.count} بـ ${x[k]}` : `${x.count} دعوة بـ ${x[k]} ر.س`)).join('، ');
    const max = p.packs[p.packs.length - 1].count;
    const beta = p.beta ? `${betaText(p.beta)}. وبعد البيتا هذي الأسعار: ` : '';
    return `${beta}تشتري رصيد دعوات مرة وحدة بدون اشتراك. لما ترسلها بنفسك: ${row('self')}. ولو تبي حيّــاك ترسلها عنك بالإيميل: ${row('email')}. وبالواتساب: ${row('whatsapp')}. وأكثر من ${max} حسب الطلب. ولو معك كود خصم تكتبه في صفحة الشراء. والشهادات داخلة مع الدعوة`;
  },
  'فيه رصيد مجاني؟': (p) => {
    if (!p) return 'إيه، فيه رصيد مجاني للتجربة ينزل أول ما تنشئ حسابك';
    const beta = p.beta ? `. وخلال النسخة التجريبية تقدر تاخذ رصيد مجاني لين ${p.beta.quota} دعوة من صفحة الرصيد` : '';
    return p.free ? `إيه، ${freeText(p.free)}، وفيها الدعوة الخاصة والعامة. ترسلها بنفسك من أي تطبيق${beta}` : beta ? `إيه${beta}` : 'حاليًا ما فيه رصيد مجاني';
  },
  'أبي تصميم بهويتي': (p) => {
    const head = 'التخصيص خدمة منفصلة عن الرصيد وسعره مستقل، ومتاح مع الرصيد المدفوع';
    if (!p) return head;
    if (p.beta?.services) return 'التخصيص مجاني خلال النسخة التجريبية: تطلبه مع الرصيد أو من صفحة طلبات التخصيص، وفريقنا يتواصل معك';
    const list = p.services.map((x) => `${x.name} ${x.price === null ? 'حسب الطلب' : `${x.price} ر.س`}`).join('، ');
    return `${head}: ${list}`;
  },
};
