'use client';
import PrivacyView from '@/views/Privacy.view';
import TermsView from '@/views/Terms.view';
import { DEFAULT_FREE } from '@/lib/constants';
import { freeText } from '@/ui/pricing';

export const Privacy = () => <PrivacyView v={{}} />;
export const Terms = ({ free = DEFAULT_FREE }) => <TermsView v={{ freeTx: freeText(free) }} />;
