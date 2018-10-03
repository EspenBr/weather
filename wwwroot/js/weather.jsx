const weatherApi = "/api/Weather";

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
            </div>
        );
    }
}

class TemperatureHist extends React.Component {
    render() {
        return (
            <div>
                <svg height="500" width="530" id="svgTemp" xmlns="http://www.w3.org/2000/svg">
                    <path id="lineYAxe" d="M 30 0 l 0 470 " stroke="#AAAAAA" strokeWidth="4" fill="none" />
                    <path id="lineXAxe" d="M 30 470 l 530 0" stroke="#AAAAAA" strokeWidth="3" fill="none" />
                    <path id="temp_lines" d="M 30 270 L 530 270 M 30 70 L 530 70" stroke="#AAAAAA" strokeDasharray="1, 5" strokeWidth="2" fill="none" />
                    <path id="tempPath" stroke="#000000" strokeWidth="3" class="temp_line" fill="none" d={this.props.data.temperature} className="path"></path>

                    <g font-size="15" fontFamily="sans-serif" fill="#666666" stroke="none" textAnchor="middle">
                        <text x="13" y="474">{this.props.data.min}</text>
                        <text x="13" y="274">{this.props.data.zero_point}</text>
                        <text x="13" y="74">{this.props.data.max}</text>
                        <text x="510" y="500">{moment(Date()).format("HH:mm")}</text>
                        <text x="390" y="500">{moment(Date()).subtract('6', 'hour').format("HH:mm")}</text>
                        <text x="260" y="500">{moment(Date()).subtract('12', 'hour').format("HH:mm")}</text>
                        <text x="130" y="500">{moment(Date()).subtract('18', 'hour').format("HH:mm")}</text>
                    </g>
                    Sorry, your browser does not support inline SVG.
            </svg>
            </div >
        );
    }
}

class Rain extends React.Component {
    render() {
        return (
            <div>
                <div className="rainSvg temp_container">
                    <span className="temp_tooltiptext">Denne måned:{this.props.data.rain_month}mm<br />Dette år:{this.props.data.rain_year}mm</span>
                    <svg viewBox="0 0 200 450" height="450">
                        <defs>
                            <filter id="dropshadow" >
                                <feGaussianBlur stdDeviation="1 1" result="shadow" />
                            </filter>
                        </defs>

                        <g z="0">
                            <path fill="none" stroke="gray" strokeWidth="2" d="M 29,422 L 29,2 M 19,402 L 143,402 M 19,202 L 29,202 M 19,6 L 29,6" filter="url(#dropshadow)" />
                        </g>
                        <g z="-100">
                            <path fill="none" stroke="#444444" strokeWidth="2" d="M 30,420 L 30,0 M 20,400 L 144,400 M 20,200 L 30,200 M 20,4 L 30,4" />
                            <rect width="105" className="dayRain" x="31" y={399 - this.props.data.rain_bar_day_value} height={this.props.data.rain_bar_day_value} >
                                <animate attributeType="XML" attributeName="height" from="0" to={this.props.data.rain_bar_day_value} dur="2s"></animate>
                                <animate attributeType="XML" attributeName="y" from="399" to={399 - this.props.data.rain_bar_day_value} dur="2s"></animate>
                            </rect>
                            <g fontSize="22" fontFamily="Dosis" fontWeight="600" fill="#888888" stroke="none" textAnchor="middle">
                                <text x="8" y="14" fill="gray" filter="url(#dropshadow)">{this.props.data.rain_bar_top_value}</text>
                                <text x="8" y="14" fill="#444444">{this.props.data.rain_bar_top_value}</text>
                                <text x="8" y="210" fill="#444444">{this.props.data.rain_bar_mid_value}</text>
                                <text x="8" y="410" fill="#444444">0</text>
                            </g>
                            <text x="70" y="384" fontSize="22" fontFamily="sans-serif" fill="#333333" stroke="none" textAnchor="middle">{this.props.data.rain_day}</text>
                            <text x="72" y="20" fontSize="22" fontFamily="sans-serif" fill="#333333" stroke="none" textAnchor="middle">Regn</text>
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
        this.state = { data: [], hist: [] };
    }

    loadDataFromServer() {
        fetch(weatherApi)
            .then(response => {
                if (!response.ok) {
                    throw Error("Network Request Failed");
                }
                return response
            })
            .then(d => d.json())
            .then(d => {
                this.setState({
                    data: d
                })

                fetch(weatherApi + '/' + (moment(Date()).format("YYYYMMDDHHmm")).substr(0, 11))
                    .then(data => data.json())
                    .then(data => {
                        this.setState({
                            hist: data
                        })
                    })
            }, () => {
                this.setState({
                    requestFailed: true
                })
            })
    }

    componentDidMount() {
        this.loadDataFromServer();
        setInterval(this.loadDataFromServer, this.props.pollInterval);
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
                    <tr><td colSpan="3" height="20px"></td></tr>
                    <tr>
                        <td className="weatherCell"><Temperature data={this.state.data} /></td>
                        <td className="weatherCell"><Rain data={this.state.data} /></td>
                        <td className="weatherCell"><TemperatureHist data={this.state.hist} /></td>
                    </tr>
                </tbody></table>
            </div>
        );
    }
}

ReactDOM.render(
    <Weather
        pollInterval={60000} />,
    document.getElementById('content')
);


