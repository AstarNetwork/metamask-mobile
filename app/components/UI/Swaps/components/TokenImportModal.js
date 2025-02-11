import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles/common';

import ModalDragger from '../../../Base/ModalDragger';
import Text from '../../../Base/Text';
import Alert from '../../../Base/Alert';
import TokenIcon from './TokenIcon';
import StyledButton from '../../StyledButton';
import { strings } from '../../../../../locales/i18n';

const styles = StyleSheet.create({
	modal: {
		margin: 0,
		justifyContent: 'flex-end',
	},
	modalView: {
		backgroundColor: colors.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	content: {
		marginVertical: 14,
		paddingHorizontal: 30,
		alignItems: 'center',
	},
	alertIcon: {
		paddingTop: 4,
		paddingRight: 8,
	},
	title: {
		fontSize: 24,
		marginVertical: 14,
	},
	tokenTitle: {
		fontSize: 18,
		textAlign: 'center',
		marginVertical: 14,
	},
	tokenAddress: {
		backgroundColor: colors.grey000,
		width: '100%',
		borderRadius: 20,
		marginVertical: 6,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	cta: {
		marginTop: 10,
		width: '100%',
	},
});

function TokenImportModal({ isVisible, dismiss, token, onPressImport }) {
	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={dismiss}
			onBackButtonPress={dismiss}
			onSwipeComplete={dismiss}
			swipeDirection="down"
			propagateSwipe
			style={styles.modal}
		>
			<SafeAreaView style={styles.modalView}>
				<ModalDragger borderless />
				<View style={styles.content}>
					<Alert
						type="error"
						renderIcon={() => (
							<FAIcon name="info-circle" style={styles.alertIcon} color={colors.red} size={15} />
						)}
					>
						{(textStyle) => <Text style={textStyle}>{strings('swaps.add_warning')}</Text>}
					</Alert>
					<Text bold primary centered style={styles.title}>
						{strings('swaps.import_token')}
					</Text>
					<TokenIcon biggest icon={token.iconUrl} symbol={token.symbol} />
					<Text bold primary centered style={styles.tokenTitle}>
						{token.name ? `${token.name} (${token.symbol})` : token.symbol}
					</Text>
					<Text primary centered small>
						{strings('swaps.contract')}
					</Text>
					<View style={styles.tokenAddress}>
						<Text small centered numberOfLines={1} adjustsFontSizeToFit>
							{token.address}
						</Text>
					</View>
					<StyledButton type="blue" containerStyle={styles.cta} onPress={onPressImport}>
						{strings('swaps.Import')}
					</StyledButton>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

TokenImportModal.propTypes = {
	isVisible: PropTypes.bool,
	dismiss: PropTypes.func,
	token: PropTypes.shape({
		address: PropTypes.string,
		name: PropTypes.string,
		symbol: PropTypes.string,
		decimals: PropTypes.number,
		iconUrl: PropTypes.string,
	}),
	onPressImport: PropTypes.func,
};
export default TokenImportModal;
