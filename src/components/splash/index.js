import React from "react";
import { connect } from "react-redux";
import DefaultSplashContent from "./splash";
import { hasExtension, getExtension } from "../../util/extensions";
import ErrorBoundary from "../../util/errorBoundary";
import { fetchJSON } from "../../util/serverInteraction";
import { getServerAddress, controlsHiddenWidth } from "../../util/globals";
import { changePage } from "../../actions/navigation";
import { loadJSONs } from "../../actions/loadData";

const SplashContent = hasExtension("splashComponent") ?
  getExtension("splashComponent") :
  DefaultSplashContent;
/* TODO: check that when compiling DefaultSplashContent isn't included if extension is defined */


@connect((state) => ({
  errorMessage: state.general.errorMessage,
  browserDimensions: state.browserDimensions.browserDimensions,
  reduxPathname: state.general.pathname
}))
class Splash extends React.Component {
  constructor(props) {
    super(props);
    /* state is set via the returned JSON from the server (aka charon) in the fetch in CDM */
    this.state = {available: {}, errorMessage: undefined};
  }
  componentDidMount() {
    const autoLoadFirstDataset = hasExtension("autoLoadFirstDataset") ? 
      getExtension("autoLoadFirstDataset") : false;

    fetchJSON(`${getServerAddress()}/getAvailable?prefix=${this.props.reduxPathname}`)
      .then((json) => {
        this.setState({available: json});
        // Auto-navigate to first dataset if enabled
        if (autoLoadFirstDataset && json.datasets && json.datasets.length > 0) {
          // Sort datasets alphabetically by request path
          const sortedDatasets = [...json.datasets].sort((a, b) => 
            a.request.localeCompare(b.request)
          );
          
          const firstDataset = sortedDatasets[0];
          utils.verbose(`Auto-navigating to first dataset: ${firstDataset.request}`);
          
          // Navigate to the first dataset
          this.props.dispatch(changePage({
            path: `/${firstDataset.request}`,
            push: true
          }));
        }
      })
      .catch((err) => {
        this.setState({errorMessage: "Error in getting available datasets"});
        console.warn(err.message);
      });
  }
  render() {
    return (
      <ErrorBoundary>
        <SplashContent
          isMobile={this.props.browserDimensions.width < controlsHiddenWidth}
          available={this.state.available}
          browserDimensions={this.props.browserDimensions}
          dispatch={this.props.dispatch}
          errorMessage={this.props.errorMessage || this.state.errorMessage}
          changePage={changePage}
        />
      </ErrorBoundary>
    );
  }
}

export default Splash;
