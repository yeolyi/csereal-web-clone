import HTMLViewer from '~/components/common/HTMLViewer';
import type { Club, WithLanguage } from '~/types/api/student-clubs';
import SelectionTitle from './SelectionTitle';

interface ClubDetailsProps {
  club: WithLanguage<Club>;
  locale: 'ko' | 'en';
}

export default function ClubDetails({ club, locale }: ClubDetailsProps) {
  const oppositeLocale = locale === 'ko' ? 'en' : 'ko';
  const topRightImage = club[locale].imageURL
    ? {
        src: club[locale].imageURL,
        width: 320,
        height: 200,
        mobileFullWidth: true,
      }
    : undefined;

  return (
    <div>
      <SelectionTitle
        title={club[locale].name}
        subtitle={club[oppositeLocale].name}
        animationKey={club[locale].name}
      />
      <HTMLViewer
        htmlContent={club[locale].description}
        topRightImage={topRightImage}
      />
    </div>
  );
}
