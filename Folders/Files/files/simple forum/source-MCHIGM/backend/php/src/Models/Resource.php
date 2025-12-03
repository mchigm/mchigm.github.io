<?php
/**
 * Resource Model - Example implementation
 * 
 * Represents a resource in the platform
 */

namespace Mchigm\Models;

class Resource
{
    private string $id;
    private string $title;
    private string $description;
    private string $type;
    private int $quantity;
    private array $tags;
    private string $status;
    private string $userId;
    private string $location;
    private string $createdAt;
    private string $updatedAt;

    /**
     * Valid status values
     */
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_RESERVED = 'reserved';
    public const STATUS_UNAVAILABLE = 'unavailable';

    /**
     * Valid resource types
     */
    public const TYPES = [
        'venue' => '场地',
        'equipment' => '设备',
        'service' => '服务',
        'material' => '物资',
        'education' => '教育',
        'funding' => '资金',
    ];

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? $this->generateId();
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->type = $data['type'] ?? '';
        $this->quantity = $data['quantity'] ?? 0;
        $this->tags = $data['tags'] ?? [];
        $this->status = $data['status'] ?? self::STATUS_AVAILABLE;
        $this->userId = $data['user_id'] ?? '';
        $this->location = $data['location'] ?? '';
        $this->createdAt = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->updatedAt = $data['updated_at'] ?? date('Y-m-d H:i:s');
    }

    /**
     * Generate unique ID
     */
    private function generateId(): string
    {
        return 'r' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6);
    }

    // Getters
    public function getId(): string
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    // Setters
    public function setTitle(string $title): self
    {
        $this->title = $title;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setTags(array $tags): self
    {
        $this->tags = $tags;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setStatus(string $status): self
    {
        if (!in_array($status, [
            self::STATUS_AVAILABLE, 
            self::STATUS_RESERVED, 
            self::STATUS_UNAVAILABLE
        ])) {
            throw new \InvalidArgumentException("Invalid status: $status");
        }
        $this->status = $status;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setLocation(string $location): self
    {
        $this->location = $location;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    /**
     * Check if resource is available
     */
    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE && $this->quantity !== 0;
    }

    /**
     * Check if resource has unlimited quantity
     */
    public function isUnlimited(): bool
    {
        return $this->quantity === -1;
    }

    /**
     * Reserve resource (decrease quantity)
     */
    public function reserve(int $amount = 1): bool
    {
        if ($this->isUnlimited()) {
            return true;
        }
        
        if ($this->quantity >= $amount) {
            $this->quantity -= $amount;
            if ($this->quantity === 0) {
                $this->status = self::STATUS_UNAVAILABLE;
            }
            $this->updatedAt = date('Y-m-d H:i:s');
            return true;
        }
        
        return false;
    }

    /**
     * Convert to array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'quantity' => $this->quantity,
            'tags' => $this->tags,
            'status' => $this->status,
            'user_id' => $this->userId,
            'location' => $this->location,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    /**
     * Create from array
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
