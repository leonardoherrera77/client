/* @flow */

// $FlowIssue base-react
import React, {Component} from '../base-react'
// $FlowIssue base-redux
import {connect} from '../base-redux'
import Render from './render'

import * as trackerActions from '../actions/tracker'
import {bindActionCreators} from 'redux'
import {warning} from '../constants/tracker'

// $FlowIssue platform dependent files
import type {RenderProps} from './render'
// $FlowIssue platform dependent files
import type {UserInfo} from './bio.render'
// $FlowIssue platform dependent files
import type {Proof} from './proofs.render'
import type {SimpleProofState} from '../constants/tracker'

type TrackerProps = {
  serverStarted: boolean,
  proofState: SimpleProofState,
  username: ?string,
  shouldFollow: ?boolean,
  reason: string,
  userInfo: UserInfo,
  proofs: Array<Proof>,
  onCloseFromHeader: () => void,
  onCloseFromActionBar: () => void,
  onRefollow: () => void,
  onUnfollow: () => void,
  onFollowHelp: () => void,
  onFollowChecked: () => void,
  registerIdentifyUi: () => void
}

class Tracker extends Component {
  props: TrackerProps;

  componentWillMount () {
    if (!this.props.serverStarted) {
      console.log('starting server')
      this.props.registerIdentifyUi()
    }
  }

  render () {
    const renderChangedTitle = this.props.proofState === warning ? `(warning) ${this.props.username} added some verifications`
      : `(error) Some of ${this.props.username}'s verifications are compromised or have changed.`

    const renderProps: RenderProps = {
      bioProps: {
        username: this.props.username,
        state: this.props.proofState,
        userInfo: this.props.userInfo
      },
      headerProps: {
        reason: this.props.reason,
        onClose: this.props.onCloseFromHeader
      },
      actionProps: {
        state: this.props.proofState,
        username: this.props.username,
        renderChangedTitle,
        shouldFollow: this.props.shouldFollow,
        onClose: this.props.onCloseFromActionBar,
        onRefollow: this.props.onRefollow,
        onUnfollow: this.props.onUnfollow,
        onFollowHelp: this.props.onFollowHelp,
        onFollowChecked: this.props.onFollowChecked
      },
      proofsProps: {
        proofs: this.props.proofs
      }
    }

    return <Render {...renderProps}/>
  }

  static parseRoute (currentPath) {
    if (currentPath.get('state')) {
      return {
        componentAtTop: {
          title: 'Tracker',
          props: {
            ...mockData,
            proofState: currentPath.get('state')
          }
        }
      }
    }

    return {
      componentAtTop: {
        title: 'Tracker',
        props: {
        }
      }
    }
  }
}

const mockData = {
  username: 'max',
  proofState: 'pending',
  reason: 'You accessed /private/cecile',
  userInfo: {
    fullname: 'Alice Bonhomme-Biaias',
    followersCount: 81,
    followingCount: 567,
    followsYou: true,
    location: 'New York, NY',
    avatar: 'https://s3.amazonaws.com/keybase_processed_uploads/2571dc6108772dbe0816deef41b25705_200_200_square_200.jpeg'
  },
  shouldFollow: true,
  proofs: [
    {"name":"marcopolo","type":"github","id":"56363c0307325cb4eedb072be7f8a5d3b29d13f5ef33650a7e910f772ff1d3710f", state: 'normal', humanUrl: "github.com/marcopolo", color: 'green'}, //eslint-disable-line
    {"name":"open_sourcery","type":"twitter","id":"76363c0307325cb4eedb072be7f8a5d3b29d13f5ef33650a7e910f772ff1d3710f", state: 'pending', humanUrl: "twitter.com/open_sourcery", color: 'gray'}, //eslint-disable-line
  ]
}

Tracker.propTypes = {
  serverStarted: React.PropTypes.any,
  proofState: React.PropTypes.any,
  username: React.PropTypes.any,
  shouldFollow: React.PropTypes.any,
  reason: React.PropTypes.any,
  userInfo: React.PropTypes.any,
  proofs: React.PropTypes.any,
  onCloseFromHeader: React.PropTypes.any,
  onCloseFromActionBar: React.PropTypes.any,
  onRefollow: React.PropTypes.any,
  onUnfollow: React.PropTypes.any,
  onFollowHelp: React.PropTypes.any,
  onFollowChecked: React.PropTypes.any,
  registerIdentifyUi: React.PropTypes.any
}

export default connect(
  state => state.tracker,
  dispatch => {
    return bindActionCreators(trackerActions, dispatch)
  },
  (stateProps, dispatchProps, ownProps) => {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps
    }
  }
)(Tracker)
