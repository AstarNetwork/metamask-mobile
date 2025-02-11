import React from 'react';
import TransactionElement from './';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

const mockStore = configureMockStore();

describe('TransactionElement', () => {
	it('should render correctly', () => {
		const initialState = {
			engine: {
				backgroundState: {
					PreferencesController: {
						selectedAddress: '0x0',
						identities: { '0xbar': { name: 'Account 1', address: '0x0', importTime: Date.now() } },
					},
					CurrencyRateController: {
						currentCurrency: 'usd',
						conversionRate: 0.1,
					},
					NetworkController: {
						provider: {
							ticker: 'ETH',
							type: 'mainnet',
						},
					},
					TransactionController: {
						swapsTransactions: {},
					},
					SwapsController: {
						tokens: [],
					},
				},
			},
			settings: {
				primaryCurrency: 'ETH',
			},
		};

		const wrapper = shallow(
			<TransactionElement
				tx={{ transaction: { to: '0x0', from: '0x1', nonce: 1 }, status: 'CONFIRMED' }}
				conversionRate={1}
				currentCurrency={'USD'}
				selectedTx={'0x0'}
				selectedAddress={'0x1'}
				i={1}
			/>,
			{
				context: { store: mockStore(initialState) },
			}
		);
		expect(wrapper.dive()).toMatchSnapshot();
	});
});
