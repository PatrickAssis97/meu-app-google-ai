import React from 'react';
import { useClock } from '../hooks/useClock';
import { SENAC_COLORS } from '../constants';
import type { FooterSettings } from '../types';

const DefaultSenacLogo: React.FC<{className: string}> = ({className}) => (
    <img 
        src="https://www.ead.senac.br/assets/images/logo-senac-white.png"
        alt="Logo Senac"
        className={className}
    />
);

interface FooterProps {
  onAdminClick: () => void;
  isLoggedIn: boolean;
  onReturnToPanel?: () => void;
  settings: FooterSettings;
  customLogoUrl: string | null;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, isLoggedIn, onReturnToPanel, settings, customLogoUrl }) => {
  const { formattedTime, formattedDate } = useClock();

  const logoClassName = "h-12 md:h-14 w-auto";

  return (
    <footer style={{ backgroundColor: SENAC_COLORS.blue }} className="h-[10vh] min-h-[70px] max-h-24 shadow-lg flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center">
        {settings.showLogo && (
          customLogoUrl 
            ? <img src={customLogoUrl} alt="Logo Personalizada" className={logoClassName} />
            : <DefaultSenacLogo className={logoClassName}/>
        )}
      </div>

      <div className="flex items-center justify-center text-center">
        {settings.showClock && (
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wider">{formattedTime}</p>
            <p className="text-xs sm:text-sm md:text-base capitalize">{formattedDate}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {isLoggedIn ? (
             <button 
              className="p-2 rounded-md text-white/90 bg-white/10 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center gap-2"
              aria-label="Voltar ao painel administrativo"
              onClick={onReturnToPanel}
            >
               <img 
                    src="https://cdn-icons-png.flaticon.com/128/2899/2899134.png"
                    alt="Voltar ao Painel"
                    className="h-6 w-6"
                />
              <span className="hidden sm:inline font-semibold">Voltar ao Painel</span>
            </button>
        ) : (
            <button 
                className="p-2 rounded-full text-white/80 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                aria-label="Acessar painel administrativo"
                onClick={onAdminClick}
            >
                <img 
                    src="https://cdn-icons-png.flaticon.com/128/18567/18567290.png"
                    alt="Painel Administrativo"
                    className="h-8 w-8"
                />
            </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;