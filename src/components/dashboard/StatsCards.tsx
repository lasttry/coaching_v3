"use client"

import { useEffect, useState } from "react"
import { UsersIcon, UserGroupIcon, CogIcon } from "@heroicons/react/24/outline"

interface Stats {
  totalUsers: number
  totalCoaches: number
  totalClients: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCoaches: 0,
    totalClients: 0
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalUsers: 1,
      totalCoaches: 0,
      totalClients: 0
    })
  }, [])

  const cards = [
    {
      name: 'Total de Utilizadores',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Coaches',
      value: stats.totalCoaches,
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Clientes',
      value: stats.totalClients,
      icon: CogIcon,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${card.color} rounded-md flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
