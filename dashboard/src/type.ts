export interface mainVar {
    version: string
    debug: boolean
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

export interface clusterConfigure {
    token: string
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

export interface billingConfigure {
    currency: string
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