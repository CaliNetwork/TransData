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
    token?: string
}

export interface orderObject {
    uuid: string
    template_uuid: string
    address: string
    phone_code: number
    phone_number: number
    instance_uuid: number
    isFinished: boolean
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
    instance_uuid: string
    content: string
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
    connection_details: {
        ipv4?: string
        ipv6?: string
        portRange?: number[]
    }
    spe_details?: vmService | portForwardingService
}

export interface billingConfigure {
    cata: settingsCata
    currency: string
}

export interface clusterConfigure {
    cata: settingsCata
    token: string
}

export interface siteConfigure {
    cata: settingsCata
    hasSetup: boolean
    rootToken: string
}

export interface serviceTemplate {
    cata: settingsCata
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

enum settingsCata {
    billingConfigure,
    clusterConfigure,
    siteConfigure,
    serviceTemplate
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
    ip?: {
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