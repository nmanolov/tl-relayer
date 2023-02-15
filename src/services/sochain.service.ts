import { envConfig } from "../config/env.config";
import { rpcClient } from "../config/rpc.config"
import { ELogType, saveLog } from "./utils.service";

const baseURL = 'https://chain.so/api/v2/';
const { NETWORK } = envConfig;

export const listunspent = async (server: any, params: any[]) => {
    try {
        const address = params?.[2]?.[0];
        const minBlock = params?.[0];
        const maxBlock = params?.[1];
        if (!address) {
            return { error: `Error with getting UTXOs. Code: 0`};
        }
        const vaRes = await rpcClient.call('validateaddress', address);
        if (vaRes.error || !vaRes.data) {
            throw new Error(vaRes.error);
        }
        const pubkey = vaRes.data.pubkey;
        if (pubkey) {
            const luRes = await rpcClient.call('listunspent', ...params);
            if (!luRes.data || luRes.error) throw new Error(`listunspent Error: ${luRes.error}`);
            const data = luRes.data.map((u: any) => {
                return {
                    txid: u.txid,
                    amount: u.amount,
                    confirmations: u.confirmations,
                    scriptPubKey: u.scriptPubKey,
                    vout: u.vout,
                };
            });
            return { data };
        } 
        const method = 'get_tx_unspent';
        const url = baseURL + method + '/' + NETWORK + '/' + address;
        const { data, error } = await server.axios.get(url);
        if (error || !data) {
            return { error: error || `Error with getting ${address} UTXOs. Code: 1`};
        } 
        const { status } = data;
        if (status !== 'success') {
            return { error: `Error with getting ${address} UTXOs. Code: 2`};
        }
        const utxos = data.data.txs
            .filter(({ confirmations }) => confirmations >= minBlock && confirmations <= maxBlock)
            .map((u: any) => {
                return {
                    txid: u.txid,
                    amount: parseFloat(u.value),
                    confirmations: u.confirmations,
                    scriptPubKey: u.script_hex,
                    vout: u.output_no,
                };
            });
        return { data: utxos };
    } catch (err) {
        return { error: err.message };
    }
}



export const getAttestationPayload = async (server: any, ip: string) => {
    try {
        if (!ip) {
            throw new Error("Cant Detect Location");
        }
        const isSafeVpnRes = await checkVPN(ip, server.axios);
        if (isSafeVpnRes.error) {
            throw new Error(`VPN Check Error: ${isSafeVpnRes.error}`);
        }
        if (isSafeVpnRes.data !== true) {
            throw new Error("VPN Check Undefined Error");
        }
        const url = `http://www.geoplugin.net/json.gp?ip=${ip}`;

        const { data, error } = await server.axios.get(url);
        if (!data || error) {
            throw new Error(error);
        }
        const { geoplugin_status, geoplugin_countryCode } = data;
        if (!geoplugin_countryCode) {
            throw new Error(`Status Code: ${geoplugin_status}`);
        }
        return rpcClient.call('tl_createpayload_attestation', geoplugin_countryCode);
    } catch (error: any) {
        return { error: error.message };
    }
};

export const importPubKey = async (server: any, params: any[]) => {
    try {
        const pubkey = params[0];
        if (!pubkey) {
            throw new Error("Pubkey not Provided");
        }
        const label = `imported-pubkeys`;
        const ipkRes = await rpcClient.call('importpubkey', pubkey, label, false);
        if (ipkRes.error) {
            throw new Error(ipkRes.error);
        }
        saveLog(ELogType.PUBKEYS, pubkey);
        return { data: true };
    } catch (error) {
        return { error: error.message };
    }
};

const checkVPN = async (ip: string, axios: any) => {
    try {
        const KEYS = envConfig.VPN_KEYS;
        const vpnCheckConf = [
            {
                url: `http://v2.api.iphub.info/ip/${ip}`,
                headers: { "X-Key": KEYS.VPN_IPHUB },
                isSafe: (data: any) => data.block === 0,
                isVPN: (data: any) => data.block === 1 || data.block === 2,
            },
            // {
            //     url: `http://ipinfo.io/${ip}`,
            //     params: { "token": KEYS.VPN_IPINFO },
            // },
            {
                url: `https://www.iphunter.info:8082/v1/ip/${ip}`,
                headers: { "X-Key": KEYS.VPN_IPHUNTER },
                isSafe: (data: any) => data.data?.block === 0,
                isVPN: (data: any) => data.block === 1 || data.block === 2,
            },
            {
                url: `https://vpnapi.io/api/${ip}`,
                params: { "key": KEYS.VPN_VPNAPI },
                isSafe: (data: any) => (
                    data.security?.vpn === false &&
                    data.security?.proxy === false &&
                    data.security?.tor === false &&
                    data.security?.relay === false
                ),
                isVPN: (data: any) => (
                    data.security?.vpn === true ||
                    data.security?.proxy === true ||
                    data.security?.tor === true ||
                    data.security?.relay === true
                ),
            },
            {
                url: `https://api.criminalip.io/v1/ip/vpn`,
                headers: { "x-api-key": KEYS.VPN_CRIMINALIP },
                params: { ip },
                isSafe: (data: any) => (data.is_vpn === false && data.is_tor === false && data.is_proxy === false),
                isVPN: (data: any) => (data.is_vpn === true || data.is_tor === true || data.is_proxy === true),
            },
        ];
        let isSafe = false;
        let isVpn = false;
        for (let i = 0; i < vpnCheckConf.length; i++) {
            if (isSafe || isVpn) {
                break;
            }
            const vpnObj = vpnCheckConf[i];
            const config: any = {};
            if (vpnObj.params) {
                config.params = vpnObj.params;
            }
            if (vpnObj.headers) {
                config.headers = vpnObj.headers;
            }
            await axios.get(vpnObj.url, config)
                .then((res: any) => {
                    const _isVpn = vpnObj.isVPN(res.data);
                    if (_isVpn) {
                        isVpn = true;
                    }
                    const _isSafe = vpnObj.isSafe(res.data);
                    if (_isSafe) {
                        isSafe = true;
                    }
                })
                .catch((err: any) => console.log(err.message));
        };
        if (!isSafe || isVpn) {
            throw new Error('VPN is not Allowed.Please make sure your VPN is turned Off');
        }
        return { data: isSafe };
    } catch (error: any) {
        return { error: error.message };
    }
};
