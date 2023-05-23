import { useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';

import '../style/Switch.css';

const ThemeSwitch = () => 
{
    useEffect(() =>
    {
        const theme = document.querySelector('body').getAttribute("data-theme");
        const switchToggle = document.getElementById('theme-switcher');
        const switchThumb = document.querySelector('.SwitchThumb');
        if(theme === 'dark')
        {
            switchToggle.setAttribute('data-state', 'checked');
            switchThumb.setAttribute('data-state', 'checked');
            switchToggle.setAttribute('aria-checked', true);
        }
        else
        {
            switchToggle.setAttribute('data-state', 'unchecked');
            switchThumb.setAttribute('data-state', 'unchecked');
            switchToggle.setAttribute('aria-checked', false);
        }
    }, []);

    const setLightTheme = () =>
    {
        document.querySelector("body").setAttribute("data-theme", "light");
    }

    const setDarkTheme = () =>
    {
        document.querySelector("body").setAttribute("data-theme", "dark");
    }

    const toggleTheme = (checked) =>
    {
        if(checked) setDarkTheme();
        else setLightTheme();
    }

    return (
        <form>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Switch.Root className="SwitchRoot" id="theme-switcher" onCheckedChange={toggleTheme}>
                    <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
                <label className="theme-label" htmlFor="theme-switcher" style={{ paddingRight: 15 }}>
                    Dark Mode
                </label>
            </div>
        </form>
    )
};
export default ThemeSwitch;
