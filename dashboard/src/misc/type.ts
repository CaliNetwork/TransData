export interface mainVar {
    version: string
    listen: string
    port: number
    db: string
    cachedb: string
}

export interface userObject {
    uuid: string
    email: string
    password: string
    isbanned: boolean
    balance: number
    register_on: number
    isAdmin: boolean
    address?: string
    phone_code?: number
    phone_number?: number
    token?: string
}

export interface orderObject {
    uuid: string
    template_uuid: string
    instance_uuid: string
    status: string
    droptime: number
}

export interface billingObject {
    uuid: string
    user_uuid: string
    order_uuid: string
    isPaid: boolean
}

export interface ticketObject {
    uuid: string
    user_uuid: string
    instance_uuid?: string
    contents: string
    isOpen: boolean
}

export interface clusterObject {
    uuid: string
    type: serviceType
    apiurl: string
}

export interface serviceObject {
    uuid: string
    cluster_uuid: string
    template_uuid: string
    spe_details?: vmService | portForwardingService
}

export interface orderConfigure {
    cata: string
    drop_wait: number
}

export interface billingConfigure {
    cata: string
    currency: string
}

export interface clusterConfigure {
    cata: string
    token: string
}

export interface siteConfigure {
    cata: string
    hasSetup: boolean
    root_token: string
}

export interface serviceTemplate {
    cata: string
    templates: serviceTemplateObject[]
}

export interface serviceTemplateObject {
    uuid: string
    type: serviceType
    price: number
    billing_cycle: billing_cycle
    hasIPV6: boolean
    VM?: {
        type: VmType
        cpu: number
        mem: number
        bandwidth: number
        traffic: number
    }
    PortForwarding?: {
        bandwidth: number
        traffic: number
    }
}
// Componments

interface vmService {
    traffic_used: number
    hasTun: boolean
    os: string
    connection_details: {
        ipv4?: string
        ipv6?: string
        portRange?: number[]
    }
}

interface portForwardingService {
    from: {
        ip: string
        port: number
    }
    to: {
        ip: string
        port: number
    },
    connection_details: {
        ipv4?: string
        ipv6?: string
        portRange?: number[]
    },
    traffic_used: number
}

enum serviceType {
    PortForwarding,
    VM
}

enum VmType {
    container,
    kvm
}

enum billing_cycle {
    monthly,
    quarterly,
    semi_annually,
    annually,
}


// In-Program components

export interface dataObject {
    user_uuid: string
    token: string
    [key: string]: any
}

export interface resultObject {
    succeed: boolean
    msg: string | undefined
    data: any
}

export interface returnObject {
    succeed?: boolean
    msg?: string
    data?: any
}

export interface requestObject {
    body: any
    query: Record<string, string | undefined>
    params: Record<string, string | undefined>
    headers: Record<string, string | undefined>
    response: resultObject
    path: string,
    ip: {
        address: string;
        family: string;
        port: number;
    }
};

export interface routerObject {
    path: string
    handler: (...args: any[]) => Promise<returnObject>
    isAdmin: boolean,
    authType: string,
    schema?: any
}