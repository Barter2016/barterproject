angular.module('BarterApp').config(function($mdThemingProvider) {

    var customPrimary = {
        '50': '#16ffe9',
        '100': '#00fce4',
        '200': '#00e2cd',
        '300': '#00c9b6',
        '400': '#00af9f',
        '500': '#009688',
        '600': '#007c71',
        '700': '#00635a',
        '800': '#004943',
        '900': '#00302c',
        'A100': '#30ffec',
        'A200': '#49ffee',
        'A400': '#63fff0',
        'A700': '#001614',
        'contrastDefaultColor': 'light'
    };
    $mdThemingProvider
        .definePalette('customPrimary', 
                        customPrimary);

    var customAccent = {
        '50': '#f4bdfe',
        '100': '#f0a4fd',
        '200': '#ec8bfd',
        '300': '#e872fc',
        '400': '#e459fc',
        '500': '#E040FB',
        '600': '#dc27fa',
        '700': '#d80efa',
        '800': '#c905ea',
        '900': '#b304d1',
        'A100': '#f8d6fe',
        'A200': '#fcefff',
        'A400': '#ffffff',
        'A700': '#9e04b8'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

    var customWarn = {
        '50': '#fbb4af',
        '100': '#f99d97',
        '200': '#f8877f',
        '300': '#f77066',
        '400': '#f55a4e',
        '500': '#F44336',
        '600': '#f32c1e',
        '700': '#ea1c0d',
        '800': '#d2190b',
        '900': '#ba160a',
        'A100': '#fccbc7',
        'A200': '#fde1df',
        'A400': '#fff8f7',
        'A700': '#a21309'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    var customBackground = {
        '50': '#f6f6f6',
        '100': '#e9e9e9',
        '200': '#dcdcdc',
        '300': '#cfcfcf',
        '400': '#c3c3c3',
        '500': '#B6B6B6',
        '600': '#a9a9a9',
        '700': '#9c9c9c',
        '800': '#909090',
        '900': '#838383',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#767676'
    };
    $mdThemingProvider
        .definePalette('customBackground', 
                        customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')

});