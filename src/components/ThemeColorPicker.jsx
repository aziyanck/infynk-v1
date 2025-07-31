// src/components/ThemeColorPicker.jsx
import React from 'react';
import { themes } from '../services/themes';

const ThemeColorPicker = ({ themeKey, setThemeKey }) => {
    const [theme, setTheme] = React.useState(themes[themeKey]);
    React.useEffect(() => {
        setTheme(themes[themeKey]);
        console.log(themeKey);
    }, []);
    return (
        <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Pick theme</h5>
            <h5>{themeKey}</h5>
            <div className="flex items-center space-x-2">
                {Object.keys(themes).map((key) => (
                    <button
                        key={key}
                        type="button"
                        title={key}
                        className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110
            ${themeKey === key ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                        style={{ backgroundColor: themes[key].primaryColor }}
                        onClick={() => setThemeKey(key)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ThemeColorPicker;