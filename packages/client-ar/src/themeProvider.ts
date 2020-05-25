import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export default createMuiTheme({
    "palette": {
        "common": {"black": "#000", "white": "#fff"},
        "type": "light",
        "primary": {
            "50": "#ECECEE",
            "100": "#C5C6CB",
            "200": "#9EA1A9",
            "300": "#7D818C",
            "400": "#5C616F",
            "500": "#3C4252",
            "600": "#353A48",
            "700": "#2D323E",
            "800": "#262933",
            "900": "#1E2129",
            "A100": "#C5C6CB",
            "A200": "#9EA1A9",
            "A400": "#5C616F",
            "A700": "#2D323E",
            "main": "#3C4252",
            "light": "#7D818C",
            "dark": "#2D323E",
            "contrastText": "#fff"
        },
        "secondary": {"light": "#29b6f6", "main": "#039be5", "dark": "#0288d1", "contrastText": "#fff"}
    },
    "typography": {
        "htmlFontSize": 10,
        "fontFamily": "Muli,Roboto,\"Helvetica\",Arial,sans-serif",
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 600,
        "fontWeightBold": 700,
        "h1": {
            "fontWeight": 300,
            "fontSize": "9.6rem",
            "lineHeight": 1.167
        },
        "h2": {
            "fontWeight": 300,
            "fontSize": "6rem",
            "lineHeight": 1.2
        },
        "h3": {
            "fontWeight": 400,
            "fontSize": "4.8rem",
            "lineHeight": 1.167
        },
        "h4": {
            "fontWeight": 400,
            "fontSize": "3.4rem",
            "lineHeight": 1.235
        },
        "h5": {
            "fontWeight": 400,
            "fontSize": "2.4rem",
            "lineHeight": 1.334
        },
        "h6": {
            "fontWeight": 600,
            "fontSize": "2rem",
            "lineHeight": 1.6
        },
        "subtitle1": {
            "fontWeight": 400,
            "fontSize": "1.6rem",
            "lineHeight": 1.75
        },
        "subtitle2": {
            "fontWeight": 600,
            "fontSize": "1.4rem",
            "lineHeight": 1.57
        },
        "body1": {
            "fontWeight": 400,
            "fontSize": "1.4rem",
            "lineHeight": 1.5
        },
        "body2": {
            "fontWeight": 400,
            "fontSize": "1.4rem",
            "lineHeight": 1.43
        },
        "button": {
            "fontWeight": 600,
            "fontSize": "1.4rem",
            "lineHeight": 1.75,
            "textTransform": "uppercase"
        },
        "caption": {
            "fontWeight": 400,
            "fontSize": "1.2rem",
            "lineHeight": 1.66
        },
        "overline": {
            "fontWeight": 400,
            "fontSize": "1.2rem",
            "lineHeight": 2.66,
            "textTransform": "uppercase"
        }
    }
})
