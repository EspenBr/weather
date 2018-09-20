function round5(x) {
    if (Math.sign(x) < 0) { return (Math.ceil(x / 5) * 5).toString() + '_neg'; }
    else { return (Math.ceil(x / 5) * 5); }
}

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <svg width="950" height="80" viewBox="0 0 950 75">
                    <rect x="0" y="0" width="950" height="75" fill="#09f" stroke="black" />
                    <g className="headerSVGText">
                        <defs>
                            <mask id="textMask">
                                <text fill="white" x="475" y="55">Været for Bønes den {moment(this.props.data.date).format('DD.MM.YYYY')} klokken {moment(this.props.data.date).format('HH:mm')}</text>
                            </mask>
                            <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                                <feOffset in="blur" dx="2.5" dy="2.5" />
                            </filter>
                        </defs>
                        <g mask="url(#textMask)">
                            <rect x="0" y="0" width="950" height="74" fill="black" />
                            <text fill="#09f" filter="url(#innerShadow)" x="475" y="55">Været for Bønes den {moment(this.props.data.date).format('DD.MM.YYYY')} klokken {moment(this.props.data.date).format('HH:mm')}</text>
                        </g>
                    </g>
                </svg>
                <div className="headerTableContainer">
                    <table className="headerTable">
                        <tbody>
                            <tr>
                                <td className="headerTableHeader">Temperatur</td>
                                <td className="headerTableHeader">Vind</td>
                                <td className="headerTableHeader">Trykk</td>
                                <td className="headerTableHeader">Regn i dag</td>
                                <td className="headerTableHeader">Regn siste time</td>
                            </tr>
                            <tr>
                                <td className="headerTableCell">{this.props.data.curr_temp}°C</td>
                                <td className="headerTableCell">{this.props.data.curr_wind_speed}m/s</td>
                                <td className="headerTableCell">{this.props.data.barometer}hpa</td>
                                <td className="headerTableCell">{this.props.data.rain_day}mm</td>
                                <td className="headerTableCell">{this.props.data.rain_last_hour}mm</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class Temperature extends React.Component {
    render() {
        //const denStyle = { container: { background: this.props.data.temp_bg_color, animation: 'fadein 2s' } };
        //const denStyle = {container { }}

        return (
            <div className="temp_container">
                <div className="de">
                    <span className="temp_tooltiptext">Dagens maks:{this.props.data.max_temp_day}&deg;C<br />Dagens min:{this.props.data.min_temp_day}&deg;C</span>
                    <div className={'den tempAni_' + round5(this.props.data.curr_temp)}>
                        <div className="dene">
                            <div className="denem">
                                <div className="deneme">
                                    {this.props.data.curr_temp}&deg;C
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

class Rain extends React.Component {
    render() {
        return (
            <div>
                <div className="rainSvg">
                    <svg viewBox="0 0 50 120">
                        <defs>
                            <filter id="dropshadow" >
                                <feGaussianBlur stdDeviation="1 1" result="shadow" />
                            </filter>
                        </defs>

                        <g z="0">
                            <path fill="none" stroke="gray" strokeWidth="2" d="M 14,116 L 14,11 M 9,111 L 35,111 M 9,61 L 14,61 M 9,12 L 14,12" filter="url(#dropshadow)" />
                        </g>
                        <g z="-100">
                            <path fill="none" stroke="#444444" strokeWidth="2" d="M 15,115 L 15,10 M 10,110 L 36,110 M 10,60 L 15,60 M 10,11 L 15,11" />
                            <rect width="20" className="dayRain" x="16" y={109 - this.props.data.rain_bar_day_value} height={this.props.data.rain_bar_day_value} >
                                <animate attributeType="XML" attributeName="height" from="0" to={this.props.data.rain_bar_day_value} dur="2s"></animate>
                                <animate attributeType="XML" attributeName="y" from="109" to={109 - this.props.data.rain_bar_day_value} dur="2s"></animate>
                            </rect>
                            <g fontSize="8" fontFamily="Dosis" fontWeight="600" fill="#AAAAAA" stroke="none" textAnchor="middle">
                                <text x="4" y="14" fill="gray" filter="url(#dropshadow)">{this.props.data.rain_bar_top_value}</text>
                                <text x="4" y="14" fill="#444444">{this.props.data.rain_bar_top_value}</text>
                                <text x="4" y="63" fill="#444444">{this.props.data.rain_bar_mid_value}</text>
                                <text x="4" y="113" fill="#444444">0</text>
                            </g>
                            <text x="25" y="106" fontSize="8" fontFamily="sans-serif" fill="#333333" stroke="none" textAnchor="middle">{this.props.data.rain_day}</text>
                            <text x="26" y="8" fontSize="8" fontFamily="sans-serif" fill="#333333" stroke="none" textAnchor="middle">Regn</text>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

class Temperatures extends React.Component {
    render() {
        return (
            <div>
                {temps}
            </div>
        );
    }
}

class Weather extends React.Component {
    constructor(props) {
        super(props);
        //this.state = { data: [] };
        this.state = { data: [] };
    }

    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.urlCurrent, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }

    componentDidMount() {
        this.loadCommentsFromServer();
        window.setInterval(() => this.loadCommentsFromServer(), this.props.pollInterval);
    }

    render() {
        let thisHour = parseInt(moment(this.state.data.date).format('HH'));
        if (this.state.data.rain_last_hour == null) document.documentElement.style.setProperty('--backgroundColor', 'white')
        else {
            if (this.state.data.rain_last_hour > 1) {
                if (thisHour > 18) {
                    document.documentElement.style.setProperty('--backgroundColor', 'light-gray')
                }
                else {
                    document.documentElement.style.setProperty('--backgroundColor', 'dark-gray')
                }
            }
            else {
                if (thisHour > 18) {
                    document.documentElement.style.setProperty('--backgroundColor', 'black');
                }
                else {
                    document.documentElement.style.setProperty('--backgroundColor', 'rgb(245, 202, 12)');
                }
            }
        }
        return (
            <div>
                <Header data={this.state.data} />
                <table><tbody>
                    <tr>
                        <td className="weatherCell"><Temperature data={this.state.data} /></td>
                        <td className="weatherCell"><Rain data={this.state.data} /></td>
                    </tr>
                </tbody></table>
            </div>
        )
            ;
    }
}

ReactDOM.render(
    <Weather urlCurrent="/api/Weather" pollInterval={60000} />,
    document.getElementById('content')
);
