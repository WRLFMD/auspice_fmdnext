import React from "react";
import { connect } from "react-redux";
import { loadJSONs } from "../../actions/loadData";
import { PAGE_CHANGE } from "../../actions/types";

/* The DatasetLoader component simply triggers the (async) loadJSONs action
 * and then redirects to the "main" page (via a PAGE_CHANGE action).
 * Note that if the loadJSONs action "fails" it will subsequently redirect to a 404 page
 */
@connect((state) => ({
  pathname: state.general.pathname
}))
class DatasetLoader extends React.Component {
  constructor(props) {
    super(props);
  }
  UNSAFE_componentWillMount() {
    // Use pathname from Redux state, not window.location.pathname
    // This ensures we use the updated path after navigation
    this.props.dispatch(loadJSONs({ url: this.props.pathname }));
    this.props.dispatch({type: PAGE_CHANGE, displayComponent: "main"});
  }
  render() {
    return null;
  }
}

export default DatasetLoader;