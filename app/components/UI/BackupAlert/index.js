import React, { PureComponent } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ElevatedView from 'react-native-elevated-view';
import { strings } from '../../../../locales/i18n';
import { colors, fontStyles, baseStyles } from '../../../styles/common';
import Device from '../../../util/device';
import { connect } from 'react-redux';
import { backUpSeedphraseAlertNotVisible } from '../../../actions/user';
import { findRouteNameFromNavigatorState } from '../../../util/general';

const BROWSER_ROUTE = 'BrowserView';

const styles = StyleSheet.create({
	backupAlertWrapper: {
		flex: 1,
		backgroundColor: colors.orange000,
		borderColor: colors.yellow300,
		borderWidth: 1,
		position: 'absolute',
		left: 16,
		right: 16,
		borderRadius: 8,
		padding: 14,
	},
	backupAlertIconWrapper: {
		marginRight: 10,
	},
	backupAlertIcon: {
		fontSize: 22,
		...fontStyles.bold,
		color: colors.black,
	},
	backupAlertTitle: {
		fontSize: 14,
		marginBottom: 14,
		color: colors.black,
		...fontStyles.bold,
	},
	backupAlertMessage: {
		fontSize: 12,
		color: colors.blue,
		marginLeft: 14,
		flex: 1,
		textAlign: 'right',
		...fontStyles.normal,
	},
	touchableView: {
		flexDirection: 'row',
	},
	modalViewInBrowserView: {
		bottom: Device.isIphoneX() ? 90 : 80,
	},
	modalViewNotInBrowserView: {
		bottom: Device.isIphoneX() ? 20 : 10,
	},
	buttonsWrapper: {
		flexDirection: 'row-reverse',
		alignContent: 'flex-end',
		flex: 1,
	},
	dismissButton: {
		flex: 1,
	},
});

const BLOCKED_LIST = [
	'ImportPrivateKey',
	'Send',
	'SendTo',
	'Amount',
	'Confirm',
	'Approval',
	'Approve',
	'AddBookmark',
	'RevealPrivateCredentialView',
	'AccountBackupStep',
	'ManualBackupStep',
];

/**
 * PureComponent that renders an alert shown when the
 * seed phrase hasn't been backed up
 */
class BackupAlert extends PureComponent {
	static propTypes = {
		navigation: PropTypes.object,
		/**
		 * redux flag that indicates if the user
		 * completed the seed phrase backup flow
		 */
		seedphraseBackedUp: PropTypes.bool,
		/**
		 * redux flag that indicates if the alert should be shown
		 */
		backUpSeedphraseVisible: PropTypes.bool,
		/**
		 * Dismisses the alert
		 */
		backUpSeedphraseAlertNotVisible: PropTypes.func.isRequired,
		/**
		 * A second prop to be used in conjunction with the above
		 * currently used to toggle the backup reminder modal (a second time)
		 */
		onDismiss: PropTypes.func,
	};

	state = {
		inBrowserView: false,
		inAccountBackupStep: false,
	};

	componentDidUpdate = async (prevProps) => {
		if (prevProps.navigation.dangerouslyGetState() !== this.props.navigation.dangerouslyGetState()) {
			const currentRouteName = findRouteNameFromNavigatorState(
				this.props.navigation.dangerouslyGetState().routes
			);

			const inBrowserView = currentRouteName === BROWSER_ROUTE;
			const blockedView =
				BLOCKED_LIST.find((path) => currentRouteName.includes(path)) || currentRouteName === 'SetPasswordFlow';
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({ inBrowserView, blockedView });
		}
	};

	goToBackupFlow = () => {
		this.props.navigation.navigate('SetPasswordFlow', { screen: 'AccountBackupStep1' });
	};

	onDismiss = () => {
		const { onDismiss, backUpSeedphraseAlertNotVisible } = this.props;
		backUpSeedphraseAlertNotVisible();
		if (onDismiss) onDismiss();
	};

	render() {
		const { seedphraseBackedUp, backUpSeedphraseVisible } = this.props;
		const { inBrowserView, blockedView } = this.state;
		if (seedphraseBackedUp || blockedView || !backUpSeedphraseVisible) return null;
		return (
			<ElevatedView
				elevation={99}
				style={[
					styles.backupAlertWrapper,
					inBrowserView ? styles.modalViewInBrowserView : styles.modalViewNotInBrowserView,
				]}
			>
				<View style={styles.touchableView} testID={'backup-alert'}>
					<View style={styles.backupAlertIconWrapper}>
						<EvilIcons name="bell" style={styles.backupAlertIcon} />
					</View>
					<View style={baseStyles.flexGrow}>
						<Text style={styles.backupAlertTitle}>{strings('backup_alert.title')}</Text>
						<View style={styles.buttonsWrapper}>
							<TouchableOpacity onPress={this.goToBackupFlow}>
								<Text style={[styles.backupAlertMessage, fontStyles.bold]}>
									{strings('backup_alert.right_button')}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={this.onDismiss} style={styles.dismissButton}>
								<Text style={styles.backupAlertMessage} testID={'notification-remind-later-button'}>
									{strings('backup_alert.left_button')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ElevatedView>
		);
	}
}

const mapStateToProps = (state) => ({
	seedphraseBackedUp: state.user.seedphraseBackedUp,
	backUpSeedphraseVisible: state.user.backUpSeedphraseVisible,
});

const mapDispatchToProps = (dispatch) => ({
	backUpSeedphraseAlertNotVisible: () => dispatch(backUpSeedphraseAlertNotVisible()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BackupAlert);
