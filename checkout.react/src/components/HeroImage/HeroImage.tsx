import { useAppSelector } from '@app/hooks';
import './HeroImage.scss';
import { RootState } from '@app/store';
import { Avatar } from '@mantine/core';
import { NavLink } from 'react-router-dom';

const HeroImage = () => {
  const { checkout } = useAppSelector((store: RootState) => store.checkout);

  return (
    <>
      {!!checkout && (
        <>
          <div className="hero-background">
            <div className="hero-image" style={{ backgroundImage: `url(${checkout.heroImage})` }}></div>
          </div>
          <div className="hero-text" style={{ color: checkout.heroImageTextColor }}>
            <div className="venue-logo">
              {!!checkout?.venue && (
                <NavLink to={checkout.venue.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Avatar
                    src={checkout.venue.logoImage}
                    alt={`${checkout.venue.name} logo`}
                    className="venue-logo__image"
                    size="xl"
                  />
                </NavLink>
              )}
            </div>
            <div className="hero-text--wrapper">
              <h1>{checkout.name}</h1>
              {!!checkout.description && <p>{checkout.description}</p>}
            </div>
          </div>
        </>
      )}
      <div className="hero-min-height"></div>
    </>
  );
};

export default HeroImage;
